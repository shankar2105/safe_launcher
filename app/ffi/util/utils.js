'use strict';

import ref from 'ref';

export const error = (msg) => {
  const promise = new Promise((resolve, reject) => {
    reject(msg);
  });
  return promise;
};

export const derefFileMetadataStruct = (metadataStruct) => {
  return {
    name: ref.reinterpret(metadataStruct.name, metadataStruct.name_len).toString(),
    metadata: ref.reinterpret(metadataStruct.user_metadata, metadataStruct.user_metadata_len).toString(),
    isPrivate: metadataStruct.is_private,
    isVersioned: metadataStruct.is_versioned
  };
};

export const derefDirectoryMetadataStruct = (metadataStruct) => {
  return {
    name: ref.reinterpret(metadataStruct.name, metadataStruct.name_len).toString(),
    metadata: ref.reinterpret(metadataStruct.user_metadata, metadataStruct.user_metadata_len).toString(),
    isPrivate: metadataStruct.is_private,
    isVersioned: metadataStruct.is_versioned
  };
};

export const consumeStringListHandle = async (safeCore, handle) => {
  const executor = (resolve, reject) => {
    const getItemAt = async (index) => {
      const executor = (resolve, reject) => {
        const onResult = (err, str) => {
          if (err) {
            return reject(err);
          }
          resolve(str);
        };
        safeCore.string_list_at.async(handle, index, onResult);
      };
      return new Promise(executor);
    };
    const onResult = async (err, length) => {
      if (err) {
        return reject(err);
      }
      const list = [];
      let i = 0;
      let temp;
      while (i < length) {
        temp = await getItemAt(i);
        list.push(temp);
        i++;
      }
      safeCore.string_list_drop.async(handle, (e) => {});
      resolve(list);
    };
    safeCore.string_list_len.async(handle, onResult);
  };
  return new Promise(executor);
};
