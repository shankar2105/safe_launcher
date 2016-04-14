import sessionManager from '../session_manager';
import { ResponseHandler } from '../utils';

let deleteOrGetDirectory = function(req, res, isDelete) {
  let sessionInfo = sessionManager.get(req.headers.sessionId);
  if (!sessionInfo) {
    return res.sendStatus(401);
  }
  let params = req.params;
  let responseHandler = new ResponseHandler(res, sessionInfo);
  if (!params.hasOwnProperty('dirPath') || !params.dirPath || !(typeof params.dirPath === 'string')) { // validating dirPath twice
    return responseHandler.onResponse('Invalid request. dirPath missing');
  }
  params.isPathShared = params.isPathShared || false; // remove this line. check line 16
  try {
    params.isPathShared = JSON.parse(params.isPathShared); // change to JSON.parse(params.isPathShared || false)
  } catch (e) {
    return res.status(400).send('Invalid request. isPathShared invalid');
  }
  if (isDelete) {
    req.app.get('api').nfs.deleteDirectory(params.dirPath, params.isPathShared,
      sessionInfo.hasSafeDriveAccess(), sessionInfo.appDirKey, responseHandler.onResponse);
  } else {
    req.app.get('api').nfs.getDirectory(params.dirPath, params.isPathShared,
      sessionInfo.permissions.hasSafeDriveAccess(), sessionInfo.appDirKey, responseHandler.onResponse);
  }
}

let move = function(req, res, isFile) {
  let sessionInfo = sessionManager.get(req.headers.sessionId);
  if (!sessionInfo) {
    return res.sendStatus(401);
  }
  let payload = JSON.parse(req.body.toString());
  let responseHandler = new ResponseHandler(res, sessionInfo);
  if (!(payload.srcPath && payload.hasOwnProperty('isSrcPathShared') && payload.destPath && payload.hasOwnProperty('isDestPathShared'))) {
    return responseHandler.onResponse('Invalid request. Manadatory parameters are missing');
  }
  payload.retainSource = payload.retainSource ? true : false;
  if (isFile) {
    req.app.get('api').nfs.moveFile(payload.srcPath, payload.isSrcPathShared, payload.destPath, payload.isDestPathShared,
      payload.retainSource, sessionInfo.hasSafeDriveAccess(), sessionInfo.appDirKey, responseHandler.onResponse);
  } else {
    req.app.get('api').nfs.moveDir(payload.srcPath, payload.isSrcPathShared, payload.destPath, payload.isDestPathShared,
      payload.retainSource, sessionInfo.hasSafeDriveAccess(), sessionInfo.appDirKey, responseHandler.onResponse);
  }
}

export var createDirectory = function(req, res) {
  let sessionInfo = sessionManager.get(req.headers.sessionId);
  if (!sessionInfo) {
    return res.sendStatus(401);
  }
  let params = JSON.parse(req.body.toString());
  let responseHandler = new ResponseHandler(res, sessionInfo);;
  if (!params.hasOwnProperty('dirPath') || !params.dirPath) {
    return responseHandler.onResponse('Invalid request. dirPath missing');
  }
  if (!params.hasOwnProperty('isPrivate')) {
    params.isPrivate = false;
  }
  params.isPathShared = params.isPathShared || false;
  params.isVersioned = params.isVersioned || false;
  params.metadata = params.metadata || '';

  if (typeof params.isVersioned !== 'boolean') {
    return responseHandler.onResponse('Invalid request. isVersioned should be a boolean value');
  }
  let appDirKey = sessionInfo.appDirKey;
  req.app.get('api').nfs.createDirectory(params.dirPath, params.isPrivate, params.isVersioned,
    params.metadata, params.isPathShared, sessionInfo.hasSafeDriveAccess(), sessionInfo.appDirKey,
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
  let reqBody = JSON.parse(req.body.toString());
  let params = req.params;
  if (!params.dirPath) {
    return responseHandler.onResponse('Invalid request. dirPath missing');
  }
  params.isPathShared = JSON.parse(params.isPathShared) || false; // will throw error if params.isPathShared is other than "true" or "false"
  reqBody.name = reqBody.name || null;
  reqBody.metadata = reqBody.metadata || null;

  if (!reqBody.name && !reqBody.metadata) {
    return responseHandler.onResponse('Invalid request. Name or metadata should be present in the request');
  }
  req.app.get('api').nfs.modifyDirectory(reqBody.name, reqBody.metadata, params.dirPath, params.isPathShared,
    sessionInfo.appDirKey, sessionInfo.hasSafeDriveAccess(), responseHandler.onResponse);
};

export var createFile = function(req, res) {
  let sessionInfo = sessionManager.get(req.headers.sessionId);
  if (!sessionInfo) {
    return res.sendStatus(401);
  }
  let responseHandler = new ResponseHandler(res, sessionInfo);;
  let reqBody = JSON.parse(req.body.toString());
  if (!reqBody.filePath) {
    return responseHandler.onResponse('Invalid request. filePath missing');
  }
  reqBody.isPathShared = reqBody.isPathShared || false;
  reqBody.metadata = reqBody.metadata || '';
  req.app.get('api').nfs.createFile(reqBody.filePath, reqBody.metadata, reqBody.isPathShared,
    sessionInfo.appDirKey, sessionInfo.hasSafeDriveAccess(), responseHandler.onResponse);
};

export var deleteFile = function(req, res) {
  let sessionInfo = sessionManager.get(req.headers.sessionId);
  if (!sessionInfo) {
    return res.sensStatus(401);
  }
  let responseHandler = new ResponseHandler(res, sessionInfo);;
  let params = req.params;
  if (!(typeof params.filePath === 'string')) {
    return responseHandler.onResponse('Invalid request. filePath is not valid');
  }
  params.isPathShared = JSON.parse(params.isPathShared) || false;
  req.app.get('api').nfs.deleteFile(params.filePath, params.isPathShared, sessionInfo.appDirKey,
    sessionInfo.hasSafeDriveAccess(), responseHandler.onResponse);
};

export var modifyFileMeta = function(req, res) {
  let sessionInfo = sessionManager.get(req.headers.sessionId);
  if (!sessionInfo) {
    return res.sendStatus(401);
  }
  let params = req.params;
  let reqBody = JSON.parse(req.body.toString());
  let responseHandler = new ResponseHandler(res, sessionInfo);;
  if (!(typeof params.filePath === 'string')) {
    return responseHandler.onResponse('Invalid request. filePath is not valid');
  }
  params.isPathShared = JSON.parse(params.isPathShared) || false;
  reqBody.metadata = reqBody.metadata || null;
  reqBody.name = reqBody.name || null;
  req.app.get('api').nfs.modifyFileMeta(reqBody.name, reqBody.metadata, params.filePath, params.isPathShared,
    sessionInfo.appDirKey, sessionInfo.hasSafeDriveAccess(), responseHandler.onResponse);
};

export var getFile = function(req, res, next) {
  let sessionInfo = sessionManager.get(req.headers.sessionId);
  if (!sessionInfo) {
    return res.sendStatus(401);
  }
  let params = req.params;
  let responseHandler = new ResponseHandler(res, sessionInfo, true);
  if (!(typeof params.filePath === 'string')) {
    return responseHandler.onResponse('Invalid request. filePath is not valid');
  }
  params.isPathShared = JSON.parse(params.isPathShared) || false;
  let offset = req.query.offset || 0;
  let length = req.query.length || 0;
  req.app.get('api').nfs.getFile(params.filePath, params.isPathShared, offset, length,
    sessionInfo.hasSafeDriveAccess(), sessionInfo.appDirKey, responseHandler.onResponse);
};

export var modifyFileContent = function(req, res) {
  let sessionInfo = sessionManager.get(req.headers.sessionId);
  if (!sessionInfo) {
    return res.sendStatus(401);
  }
  let params = req.params;
  let reqBody = req.body.toString('base64');
  let query = req.query;
  let responseHandler = new ResponseHandler(res, sessionInfo);
  if (!(typeof params.filePath === 'string')) {
    return responseHandler.onResponse('Invalid request. filePath is not valid');
  }
  params.isPathShared = JSON.parse(params.isPathShared) || false;
  if (!reqBody) {
    return responseHandler.onResponse('Invalid request.');
  }

  if (query.offset && isNaN(query.offset)) {
    return responseHandler.onResponse('Invalid request. offset should be a number');
  }

  req.app.get('api').nfs.modifyFileContent(reqBody, parseInt(query.offset), params.filePath, params.isPathShared,
    sessionInfo.appDirKey, sessionInfo.hasSafeDriveAccess(), responseHandler.onResponse);
};

export var moveDirectory = function(req, res) {
  move(req, res, false);
}

export var moveFile = function(req, res) {
  move(req, res, true);
}
