import sessionManager from '../session_manager';
import { ResponseHandler } from '../utils';
import fs from 'fs';
import { log } from './../../logger/log';

const ROOT_PATH = {
  app: false,
  drive: true
};

const FILE_OR_DIR_ACTION = {
  copy: true,
  move: false
};

class FileUploader {

  constructor(req, res, sessionInfo, responseHandler) {
    this.req = req;
    this.res = res;
    this.sessionInfo = sessionInfo;
    this.responseHandler = responseHandler;
  }

  upload() {
    let reqBody = this.req.body;
    let fileContent = fs.readFileSync(reqBody.localFilePath).toString('base64');
    log.debug('NFS - FileUploader - Invoking modifying file content');
    this.req.app.get('api').nfs.modifyFileContent(fileContent, 0, reqBody.filePath, reqBody.isPathShared,
    this.sessionInfo.appDirKey, this.sessionInfo.hasSafeDriveAccess(), this.responseHandler.onResponse);
  }

}

let deleteOrGetDirectory = function(req, res, isDelete) {
  let sessionInfo = sessionManager.get(req.headers.sessionId);
  if (!sessionInfo) {
    return res.sendStatus(401);
  }
  let responseHandler = new ResponseHandler(res, sessionInfo);
  let rootPath = ROOT_PATH[req.params.rootPath.toLowerCase()];
  if (typeof rootPath === 'undefined') {
    return responseHandler.onResponse('Invalid request. \'rootPath\' mismatch');
  }
  let dirPath = req.params['0'];
  if (isDelete) {
    log.debug('NFS - Invoking Delete directory request');
    req.app.get('api').nfs.deleteDirectory(dirPath, rootPath,
      sessionInfo.hasSafeDriveAccess(), sessionInfo.appDirKey, responseHandler.onResponse);
  } else {
    log.debug('NFS  - Invoking Get directory request');
    req.app.get('api').nfs.getDirectory(dirPath, rootPath,
      sessionInfo.hasSafeDriveAccess(), sessionInfo.appDirKey, responseHandler.onResponse);
  }
}

let move = function(req, res, isFile) {
  let sessionInfo = sessionManager.get(req.headers.sessionId);
  if (!sessionInfo) {
    return res.sendStatus(401);
  }
  let responseHandler = new ResponseHandler(res, sessionInfo);
  let reqBody = req.body;
  if (!(reqBody.srcPath && reqBody.hasOwnProperty('isSrcPathShared') &&
    reqBody.destPath && reqBody.hasOwnProperty('isDestPathShared'))) {
    return responseHandler.onResponse('Invalid request. Manadatory parameters are missing');
  }
  let srcRootPath = ROOT_PATH[reqBody.srcRootPath.toLowerCase()];
  if (typeof srcRootPath === 'undefined') {
    return responseHandler.onResponse('Invalid request. \'srcRootPath\' mismatch');
  }
  let destRootPath = ROOT_PATH[reqBody.destRootPath.toLowerCase()];
  if (typeof destRootPath === 'undefined') {
    return responseHandler.onResponse('Invalid request. \'destRootPath\' mismatch');
  }
  reqBody.action = reqBody.action || 'MOVE';
  let action = FILE_OR_DIR_ACTION[reqBody.action.toLowerCase()];
  if (typeof action === 'undefined') {
    return responseHandler.onResponse('Invalid request. \'action\' mismatch');
  }
  if (isFile) {
    log.debug('NFS - Invoking move file request');
    req.app.get('api').nfs.moveFile(reqBody.srcPath, srcRootPath, reqBody.destPath, destRootPath,
      action, sessionInfo.hasSafeDriveAccess(), sessionInfo.appDirKey, responseHandler.onResponse);
  } else {
    log.debug('NFS - Invoking move directory request');
    req.app.get('api').nfs.moveDir(reqBody.srcPath, srcRootPath, reqBody.destPath, destRootPath,
      action, sessionInfo.hasSafeDriveAccess(), sessionInfo.appDirKey, responseHandler.onResponse);
  }
}

export var createDirectory = function(req, res) {
  let sessionInfo = sessionManager.get(req.headers.sessionId);
  if (!sessionInfo) {
    return res.sendStatus(401);
  }
  let responseHandler = new ResponseHandler(res, sessionInfo);;
  let reqBody = req.body;
  let rootPath = ROOT_PATH[req.params.rootPath.toLowerCase()];
  if (typeof rootPath === 'undefined') {
    return responseHandler.onResponse('Invalid request. \'rootPath\' mismatch');
  }
  let dirPath = req.params['0'];
  reqBody.metadata = reqBody.metadata || '';
  reqBody.isPrivate = reqBody.isPrivate || false;
  if (typeof reqBody.metadata !== 'string') {
    return responseHandler.onResponse('Invalid request. \'metadata\' should be a string value');
  }
  if (typeof reqBody.isPrivate !== 'boolean') {
    return responseHandler.onResponse('Invalid request. \'isPrivate\' should be a boolean value');
  }
  let appDirKey = sessionInfo.appDirKey;
  log.debug('NFS - Invoking create directory request');
  req.app.get('api').nfs.createDirectory(dirPath, reqBody.isPrivate, false,
    reqBody.metadata, rootPath, sessionInfo.hasSafeDriveAccess(), sessionInfo.appDirKey,
    responseHandler.onResponse);
}

export var deleteDirectory = function(req, res) {
  deleteOrGetDirectory(req, res, true);
}

export var getDirectory = function(req, res) {
  deleteOrGetDirectory(req, res, false);
};

export var modifyDirectory = function(req, res) {
  let sessionInfo = sessionManager.get(req.headers.sessionId);
  if (!sessionInfo) {
    return res.sendStatus(401);
  }
  let responseHandler = new ResponseHandler(res, sessionInfo);
  let reqBody = req.body;
  let rootPath = ROOT_PATH[req.params.rootPath.toLowerCase()];
  if (typeof rootPath === 'undefined') {
    return responseHandler.onResponse('Invalid request. \'rootPath\' mismatch');
  }
  let dirPath = req.params['0'];
  reqBody.name = reqBody.name || '';
  reqBody.metadata = reqBody.metadata || '';

  if (!reqBody.name && !reqBody.metadata) {
    return responseHandler.onResponse('Invalid request. Name or metadata should be present in the request');
  }
  if (typeof reqBody.metadata !== 'string') {
    return responseHandler.onResponse('Invalid request. \'metadata\' should be a string value');
  }
  if (typeof reqBody.name !== 'string') {
    return responseHandler.onResponse('Invalid request. \'name\' should be a string value');
  }
  log.debug('NFS - Invoking modify directory request');
  req.app.get('api').nfs.modifyDirectory(reqBody.name, reqBody.metadata, dirPath, rootPath,
    sessionInfo.appDirKey, sessionInfo.hasSafeDriveAccess(), responseHandler.onResponse);
};

export var moveDirectory = function(req, res) {
  move(req, res, false);
}

export var createFile = function(req, res) {
  let sessionInfo = sessionManager.get(req.headers.sessionId);
  if (!sessionInfo) {
    return res.sendStatus(401);
  }
  let responseHandler = new ResponseHandler(res, sessionInfo);;
  let reqBody = req.body;
  let filePath = req.params['0'];
  let rootPath = ROOT_PATH[req.params.rootPath.toLowerCase()];
  if (typeof rootPath === 'undefined') {
    return responseHandler.onResponse('Invalid request. \'rootPath\' mismatch');
  }
  reqBody.metadata = reqBody.metadata || '';
  if (typeof reqBody.metadata !== 'string') {
    return responseHandler.onResponse('Invalid request. \'metadata\' should be a string value');
  }
  log.debug('NFS - Invoking create file request');
  req.app.get('api').nfs.createFile(filePath, reqBody.metadata, rootPath,
    sessionInfo.appDirKey, sessionInfo.hasSafeDriveAccess(), function(err) {
      if (err) {
        return responseHandler.onResponse(err);
      }
      if (reqBody.localFilePath) {
        log.debug('NFS - Preparing upload of file content ' + reqBody.localFilePath);
        try {
          if (fs.statSync(reqBody.localFilePath).isFile()) {
            log.debug('NFS - Uploading file content');
            let uploader = new FileUploader(req, res, sessionInfo, responseHandler);
            uploader.upload();
          } else {
            responseHandler.onResponse('localFilePath is not referring to a valid file');
          }
        } catch (e) {
          return responseHandler.onResponse('localFilePath is not valid' + e.message);
        }
      } else {
        responseHandler.onResponse();
      }
    });
};

export var deleteFile = function(req, res) {
  let sessionInfo = sessionManager.get(req.headers.sessionId);
  if (!sessionInfo) {
    return res.sensStatus(401);
  }
  let responseHandler = new ResponseHandler(res, sessionInfo);;
  let filePath = req.params['0'];
  let rootPath = ROOT_PATH[req.params.rootPath.toLowerCase()];
  if (typeof rootPath === 'undefined') {
    return responseHandler.onResponse('Invalid request. \'rootPath\' mismatch');
  }
  log.debug('NFS - Invoking Delete file request');
  req.app.get('api').nfs.deleteFile(filePath, rootPath, sessionInfo.appDirKey,
    sessionInfo.hasSafeDriveAccess(), responseHandler.onResponse);
};

export var modifyFileMeta = function(req, res) {
  let sessionInfo = sessionManager.get(req.headers.sessionId);
  if (!sessionInfo) {
    return res.sendStatus(401);
  }
  let responseHandler = new ResponseHandler(res, sessionInfo);;
  let reqBody = req.body;
  let filePath = req.params['0'];
  let rootPath = ROOT_PATH[req.params.rootPath.toLowerCase()];
  if (typeof rootPath === 'undefined') {
    return responseHandler.onResponse('Invalid request. \'rootPath\' mismatch');
  }
  reqBody.metadata = reqBody.metadata || '';
  reqBody.name = reqBody.name || '';
  if (typeof reqBody.metadata !== 'string') {
    return responseHandler.onResponse('Invalid request. \'metadata\' should be a string value');
  }
  if (typeof reqBody.name !== 'string') {
    return responseHandler.onResponse('Invalid request. \'name\' should be a string value');
  }
  log.debug('NFS - Invoking modify file metadata request');
  req.app.get('api').nfs.modifyFileMeta(reqBody.name, reqBody.metadata, filePath, rootPath,
    sessionInfo.appDirKey, sessionInfo.hasSafeDriveAccess(), responseHandler.onResponse);
};

export var getFile = function(req, res, next) {
  let sessionInfo = sessionManager.get(req.headers.sessionId);
  if (!sessionInfo) {
    return res.sendStatus(401);
  }
  let responseHandler = new ResponseHandler(res, sessionInfo, true);
  let filePath = req.params['0'];
  let rootPath = ROOT_PATH[req.params.rootPath.toLowerCase()];
  if (typeof rootPath === 'undefined') {
    return responseHandler.onResponse('Invalid request. \'rootPath\' mismatch');
  }
  var offset = 0;
  let length = 0;
  let range = req.headers[ 'range' ];
  if (range) {
    range = range.replace(/bytes=/g, '').split('-');
    offset = range[0];
    length = range[1] && (range[1] > range[0]) ? (range[1] - range[0]) : range[0];
  }
  log.debug('NFS - Invoking Get file request');
  req.app.get('api').nfs.getFile(filePath, rootPath, offset, length,
    sessionInfo.hasSafeDriveAccess(), sessionInfo.appDirKey, responseHandler.onResponse);
};

// TODO: Need code change according to v0.5
export var modifyFileContent = function(req, res) {
  let sessionInfo = sessionManager.get(req.headers.sessionId);
  if (!sessionInfo) {
    return res.sendStatus(401);
  }
  let params = req.params;
  let reqBody = req.body;
  let query = req.query;
  let responseHandler = new ResponseHandler(res, sessionInfo);
  if (!(typeof params.filePath === 'string')) {
    return responseHandler.onResponse('Invalid request. filePath is not valid');
  }
  params.isPathShared = JSON.parse(params.isPathShared) || false;
  if (!reqBody) {
    return responseHandler.onResponse('Invalid request.');
  }

  if (!query.offset || isNaN(query.offset)) {
    return responseHandler.onResponse('Invalid request. offset should be a number');
  }
  log.debug('NFS - Invoking Modify file content request');
  req.app.get('api').nfs.modifyFileContent(reqBody, parseInt(query.offset), params.filePath, params.isPathShared,
    sessionInfo.appDirKey, sessionInfo.hasSafeDriveAccess(), responseHandler.onResponse);
};

export var moveFile = function(req, res) {
  move(req, res, true);
}
