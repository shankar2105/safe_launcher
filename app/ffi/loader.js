import os from 'os';
import ffi from 'ffi';
import path from 'path';
import { remote } from 'electron';

import FfiApi from './ffi_api';
import nfs from './api/nfs';
import dns from './api/dns';
import auth from './api/auth';
import misc from './api/misc';
import dataId from './api/data_id';
import cipherOpts from './api/cipher_opts';
import immutableData from './api/immutable_data';
import structuredData from './api/structured_data';
import appendableData from './api/appendable_data';
import appManager from './util/app_manager';
import sessionManager from './util/session_manager';
import log from '../logger/log';

let ffiFunctions = {};
// add modules in the order of invoking the drop function
const mods = [nfs, appManager, sessionManager, auth, dns, immutableData,
  structuredData, appendableData, misc, dataId, cipherOpts];

mods.forEach(mod => {
  if (!(mod instanceof FfiApi)) {
    return;
  }
  const functionsToRegister = mod.getFunctionsToRegister();
  if (!functionsToRegister) {
    return;
  }
  ffiFunctions = Object.assign({}, ffiFunctions, functionsToRegister);
});

export const loadLibrary = async(ffiDirPath) => {
  let libPath = ffiDirPath;
  if (!libPath) {
    libPath = (!remote || !remote.getGlobal('args').isProduction) ?
      path.resolve(process.cwd(), 'app', 'ffi') : (`${remote.app.getAppPath()}.unpacked/dist`);
  }
  libPath = path.resolve(libPath, (os.platform() === 'win32') ? 'safe_core' : 'libsafe_core');
  console.warn('Library loaded from - ', libPath);
  /* eslint-disable new-cap */
  const safeCore = ffi.Library(libPath, ffiFunctions);
  /* eslint-enable new-cap */
  safeCore.init_logging();
  mods.forEach(mod => {
    if (!(mod instanceof FfiApi)) {
      return;
    }
    mod.setSafeCore(safeCore);
  });
};

export const setFileLoggerPath = () => (
  misc.getLogFilePath().then(logPath => {
    log.setFileLogger(logPath);
  })
);

export const cleanup = () => {
  let promise;
  const executor = async(mod) => {
    try {
      promise = mod.drop();
      if (promise) {
        await promise;
      }
    } catch (e) {
      console.error(e);
    }
  };
  mods.forEach(mod => {
    if (!(mod instanceof FfiApi)) {
      return;
    }
    executor(mod);
  });
};
