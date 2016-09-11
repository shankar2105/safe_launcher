import ref from 'ref';

import FfiApi from '../ffi_api';

const int32 = ref.types.int32;
const u64 = ref.types.uint64;
const u8 = ref.types.uint8;
const bool = ref.types.bool;
const u8Pointer = ref.refType(u8);
const u64Pointer = ref.refType(u64);

const PointerToU8Pointer = ref.refType(u8Pointer);

class Misc extends FfiApi {

  constructor() {
    super();
  }

  getFunctionsToRegister() {
    return {
      'misc_encrypt_key_free': [int32, [u64]],
      'misc_sign_key_free': [int32, [u64]],
      'misc_serailise_data_id': [int32, [u64, PointerToU8Pointer, u8Pointer, u8Pointer]],
      'misc_deserailise_data_id': [int32, [u8Pointer, u64, u64Pointer]],
      'misc_u8_ptr_free': [int32, [u8Pointer, u64, u64]]
    };
  }

  dropEncryptKeyHandle(handleId) {
    const self = this;
    const executor = (resolve, reject) => {
      const onResult = (err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        resolve();
      };
      self.safeCore.misc_encrypt_key_free.async(handleId, onResult);
    };
    return new Promise(executor);
  }

  dropSignKeyHandle(handleId) {
    const self = this;
    const executor = (resolve, reject) => {
      const onResult = (err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        resolve();
      };
      self.safeCore.misc_sign_key_free.async(handleId, onResult);
    };
    return new Promise(executor);
  }

  dropVector(dataPointer, size, capacity) {
    const self = this;
    const executor = (resolve, reject) => {
      const onResult = (err, res) => {
        // if (err || res !== 0) {
        //   return reject(err || res);
        // }
        resolve();
      };
      self.safeCore.misc_u8_ptr_free.async(dataPointer, size, capacity, onResult);
    };
    return new Promise(executor);
  }

  serialiseDataId(handleId) {
    const self = this;
    const executor = (resolve, reject) => {
      const dataPointerRef = ref.alloc(PointerToU8Pointer);
      const sizeRef = ref.alloc(u8);
      const capacityRef = ref.alloc(u8);
      const onResult = (err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        const size = sizeRef.deref();
        const capacity = capacityRef.deref();
        const dataPointer = dataPointerRef.deref();
        const data = ref.reinterpret(dataPointer, size);
        self.dropVector(dataPointer, size, capacity);
        resolve(data);
      };
      self.safeCore.misc_serailise_data_id.async(handleId, dataPointerRef,
        sizeRef, capacityRef, onResult);
    };
    return new Promise(executor);
  }

  deserialiseDataId(data) {
    const self = this;
    const executor = (resolve, reject) => {
      const handleRef = ref.alloc(u8);
      const onResult = (err, res) => {
        if (err || res !== 0) {
          return reject(err || res);
        }
        resolve(handleRef.deref());
      };
      self.safeCore.misc_deserailise_data_id.async(data, data.length, handleRef, onResult);
    };
    return new Promise(executor);
  }

}

const misc = new Misc();
export default misc;
