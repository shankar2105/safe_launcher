import { log } from './../../logger/log';
import { updateAppActivity } from './../utils.js';
var Readable = require('stream').Readable;
var util = require('util');

export var DnsReader = function(req, res, longName, serviceName, filePath, start, end, app) {
  Readable.call(this);
  this.req = req;
  this.res = res;
  this.longName = longName;
  this.serviceName = serviceName;
  this.filePath = filePath;
  this.start = start;
  this.end = end;
  this.curOffset = start;
  this.sizeToRead = 0;
  this.app = app;
  return this;
};

util.inherits(DnsReader, Readable);

/*jscs:disable disallowDanglingUnderscores*/
DnsReader.prototype._read = async () => {
  /*jscs:enable disallowDanglingUnderscores*/
  try {
    const self = this;
    if (self.curOffset === self.end) {
      self.push(null);
      return updateAppActivity(self.req, self.res, true);
    }
    let MAX_SIZE_TO_READ = 1048576; // 1 MB
    const diff = this.end - this.curOffset;
    let eventEmitter = self.req.app.get('eventEmitter');
    let eventType = self.req.app.get('EVENT_TYPE').DATA_DOWNLOADED;
    this.sizeToRead = diff > MAX_SIZE_TO_READ ? MAX_SIZE_TO_READ : diff;
    let data = await dns.readFile(this.app, this.longName, this.serviceName, this.filePath, this.curOffset,
      this.sizeToRead);
    self.curOffset += self.sizeToRead;
    self.push(new Buffer(data, 'base64'));
    eventEmitter.emit(eventType, data.length);
  } catch(e) {
    self.push(null);
    log.error(err);
    updateAppActivity(self.req, self.res);
    return self.res.end();
  }
};
