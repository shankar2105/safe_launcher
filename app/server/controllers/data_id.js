import sessionManager from '../session_manager';
import {ResponseError, ResponseHandler} from '../utils';
import misc from '../../ffi/api/misc';
import dataId from '../../ffi/api/data_id';

const API_ACCESS_NOT_GRANTED = 'Low level api access is not granted';
const UNAUTHORISED_ACCESS = 'Unauthorised access';
const HANDLE_ID_KEY = 'Handle-Id';

// GET /handleId
export const serialise = async (req, res, next) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    const sessionInfo = sessionManager.get(req.sessionId);
    if (!sessionInfo) {
      return next(new ResponseError(401, UNAUTHORISED_ACCESS));
    }
    const app = sessionInfo.app;
    if (!app.permission.lowLevelAccess) {
      return next(new ResponseError(403, API_ACCESS_NOT_GRANTED));
    }
    const data = await misc.serialise(req.params.handleId);
    responseHandler(null, data);
  } catch(e) {
    responseHandler(e);
  }
};

// POST /
export const deserialise = async (req, res, next) => {
  const responseHandler = new ResponseHandler(req, res);
  try {
    const sessionInfo = sessionManager.get(req.sessionId);
    if (!sessionInfo) {
      return next(new ResponseError(401, UNAUTHORISED_ACCESS));
    }
    const app = sessionInfo.app;
    if (!app.permission.lowLevelAccess) {
      return next(new ResponseError(403, API_ACCESS_NOT_GRANTED));
    }
    const dataHandle = await misc.deserialise(req.body);
    res.set('Handle-Id', dataHandle);
  } catch(e) {
    responseHandler(e);
  }
};

// DELETE /id
export const dropHandle = (req, res, next) => {
  const sessionInfo = sessionManager.get(req.headers.sessionId);
  if (!sessionInfo) {
    return next(new ResponseError(401, UNAUTHORISED_ACCESS));
  }
  const app = sessionInfo.app;
  if (!app.permission.lowLevelAccess) {
    return next(new ResponseError(403, API_ACCESS_NOT_GRANTED));
  }
  const responseHandler = new ResponseHandler(req, res);
  dataId.dropHandle(req.params.handleId)
    .then(responseHandler, responseHandler, console.error);
};
