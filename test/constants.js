export const CONSTANTS = {
	AUTH_PAYLOAD: {
    app: {
      name: 'test app name',
      id: 'test.maidsafe.net',
      version: '0.0.1',
      vendor: 'MaidSafe'
    },
    permissions: []
  },
  API: {
    NFS_DIR: 'nfs/directory/'
  }
};

export const MESSAGES = {
	FIELDS_MISSING_MSG: 'Required fields are missing',
	EMPTY_VALUE_MSG: 'Values cannot be empty',
	INVALID_PERMISSION_REQ: 'Invalid permissions requested',
  UNAUTHORISED: 'Unauthorised',
	INVALID_DIR_PATH: 'Directory path specified is not valid',
  CANNOT_DELETE_ROOT: 'Cannot delete root directory',
  REQUIRED_PARAMS_MISSING: 'Invalid request. Required parameters are missing'
};