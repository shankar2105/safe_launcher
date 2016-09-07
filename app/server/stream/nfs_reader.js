import { log } from './../../logger/log';
import nfs from '../../ffi/api/nfs';
import { updateAppActivity } from './../utils.js';
var Readable = require('stream').Readable;
var util = require('util');

export var NfsReader = function(req, res, filePath, isPathShared, start, end, app) {
  Readable.call(this);
  this.req = req;
  this.res = res;
  this.filePath = filePath;
  this.isPathShared = isPathShared;
  this.start = start;
  this.end = end;
  this.curOffset = start;
  this.sizeToRead = 0;
  this.app = app;
  return this;
};

util.inherits(NfsReader, Readable);

/*jscs:disable disallowDanglingUnderscores*/
NfsReader.prototype._read = function() {
  const self = this;
  if (self.curOffset === self.end) {
    updateAppActivity(self.req, self.res, true);
    return self.push(null);
  }
  const MAX_SIZE_TO_READ = 1048576; // 1 MB
  const diff = this.end - this.curOffset;
  const eventEmitter = self.req.app.get('eventEmitter');
  const eventType = self.req.app.get('EVENT_TYPE').DATA_DOWNLOADED;
  this.sizeToRead = diff > MAX_SIZE_TO_READ ? MAX_SIZE_TO_READ : diff;
  nfs.readFile(this.app, this.filePath, this.isPathShared,
    this.curOffset, this.sizeToRead).then((data) => {
      self.curOffset += self.sizeToRead;
      data = new Buffer(data.toString(), 'base64');
      self.push(data);
      eventEmitter.emit(eventType, data.length);
    }, (err) => {
      self.push(null);
      log.error(err);
      updateAppActivity(self.req, self.res);
      self.res.end();
    }, console.error);
};
/*jscs:enable disallowDanglingUnderscores*/
