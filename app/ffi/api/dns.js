'use strict'

import ref from 'ref';

import appManager from '../util/app_manager';
import { error, consumeStringListHandle } from '../util/utils';
import FfiApi from '../ffi_api';

const CString = ref.types.CString;
const int32 = ref.types.int32;
const u8 = ref.types.uint8;
const u64 = ref.types.uint64;
const Void = ref.types.void;
const PointerHandle = ref.refType(Void);
const u8Pointer = ref.refType(u8);
const PointerToVoidPointer = ref.refType(ref.refType(Void));

class DNS extends FfiApi {

  constructor() {
    super();
  }

  getFunctionsToRegister() {
   return {
     'dns_register_long_name': [int32, [PointerHandle, u8Pointer, u64]],
     'dns_get_long_names': [int32, [PointerHandle, PointerToVoidPointer]],
     'dns_delete_long_name': [int32, [PointerHandle, u8Pointer, u64]],
     'string_list_len': [u64, [PointerHandle]],
     'string_list_at': [CString, [PointerHandle, u64]],
     'string_list_drop': [Void, [PointerHandle]]
   };
  }

  registerLongName(app, longName) {
    if (!longName || !longName.trim()) {
      return error('Invalid parameters');
    }
    const executor = (resolve, reject) => {
      const onResult = (err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        resolve();
      };
      const longNameBuffer = new Buffer(longName);
      this.safeCore.dns_register_long_name.async(appManager.getHandle(app),
        longNameBuffer, longNameBuffer.length, onResult);
    };
    return new Promise(executor);
  }

  listLongNames(app) {
    if (!app) {
      return error('Application parameter is mandatory');
    }
    return new Promise((resolve, reject) => {
      const listHandlePointer = ref.alloc(PointerToVoidPointer);
      const onResult = (err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        const listHandle = listHandlePointer.deref();
        resolve(consumeStringListHandle(this.safeCore, listHandle));
      };
      this.safeCore.dns_get_long_names.async(appManager.getHandle(app), listHandlePointer, onResult);
    });
  }
}

const dns = new DNS();
export default dns;
