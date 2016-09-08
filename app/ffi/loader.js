'use strict';

import os from 'os';
import ffi from 'ffi';
import path from 'path';
import { remote } from 'electron';

import FfiApi from './ffi_api';
import nfs from './api/nfs';
import dns from './api/dns';
import auth from './api/auth';
import dataId from './api/data_id';
import immutableData from './api/immutable_data';
import structuredData from './api/structured_data';
import appManager from './util/app_manager';
import sessionManager from './util/session_manager';

let ffiFunctions = {};
// add modules in the order of invoking the drop function
let mods = [nfs, appManager, sessionManager, auth, dns, immutableData, structuredData, dataId];

mods.forEach(mod => {
  if (!(mod instanceof FfiApi)) {
    return;
  }
  let functionsToRegister = mod.getFunctionsToRegister();
  if (!functionsToRegister) {
    return;
  }
  ffiFunctions = Object.assign({}, ffiFunctions, functionsToRegister);
});

export const loadLibrary = () => {
  let libPath = path.resolve(((process.env.NODE_ENV === 'production') ? remote.app.getAppPath() : process.cwd()), 'dist', 'ffi');
  libPath =  path.resolve(libPath, (os.platform() === 'win32') ? 'safe_core' : 'libsafe_core');
  const safeCore = ffi.Library(libPath, ffiFunctions);
  console.log('Library loaded from - ', libPath);
  mods.forEach(mod => {
    if (!(mod instanceof FfiApi)) {
      return;
    }
    mod.setSafeCore(safeCore);
  });
};

export const cleanup = () => {
  const executor = async (mod) => {
    try {
      const promise = mod.drop();
      if (promise) {
        await promise;
      }
    } catch (e) {
      console.log(e);
    }
  };
  mods.forEach(mod => {
    if (!(mod instanceof FfiApi)) {
      return;
    }
    executor(mod);
  });
};
