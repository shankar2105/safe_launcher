'use strict';

import ref from 'ref';

export const error = (msg) => {
  const promise = new Promise((resolve, reject) => {
    reject(msg);
  });
  return promise;
};

export const derefFileMetadataStruct = (metadataStruct) => {
  let name = '';
  let metadata = '';
  if (metadataStruct.name_len > 0) {
    name = ref.reinterpret(metadataStruct.name, metadataStruct.name_len).toString();
  }
  if (metadataStruct.user_metadata_len > 0) {
    metadata = ref.reinterpret(metadataStruct.user_metadata, metadataStruct.user_metadata_len).toString();
  }
  return {
    name: name,
    metadata: metadata,    
    size: metadataStruct.size,
    createdOn: 'to be set',
    modifiedOn: 'to be set'
  };
};

export const derefDirectoryMetadataStruct = (metadataStruct) => {
  let name = '';
  let metadata = '';
  if (metadataStruct.name_len > 0) {
    name = ref.reinterpret(metadataStruct.name, metadataStruct.name_len).toString();
  }
  if (metadataStruct.user_metadata_len > 0) {
    metadata = ref.reinterpret(metadataStruct.user_metadata, metadataStruct.user_metadata_len).toString();
  }  return {
    name: name,
    metadata: metadata,
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
