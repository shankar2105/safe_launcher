'use strict';

export const availablePermissions = [
  'SAFE_DRIVE_ACCESS',
  'LOW_LEVEL_API'
];

export default class Permission {

  constructor(permissionsRequested = []) {
    permissionsRequested.forEach(permission => {
      if (availablePermissions.indexOf(permission) === -1) {
        throw new Error('Invalid permission - ' + permission);
      }
    });
    this.permissionsRequested = permissionsRequested;
  }

  _validate(index) {
    return this.permissionsRequested.indexOf(availablePermissions[index]) > -1;
  }

  isEqual(compareWith) {
    compareWith = compareWith || [];
    if (compareWith.length !== this.permissionsRequested.length) {
      return false;
    }
    for (var i in compareWith) {
      if (this.permissionsRequested.indexOf(compareWith[i]) < 0) {
        return false;
      }
    }
    return true;
  }

  get safeDrive() {
    return this._validate(0);
  }

  get lowLevelApi() {
    return this._validate(1);
  }

  get list() {
    return this.permissionsRequested;
  }

}
