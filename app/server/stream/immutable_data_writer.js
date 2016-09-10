import util from 'util';
import { Writable } from 'stream';
import immutableData from '../../ffi/api/immutable_data';

export var ImmutableDataWriter = function(req, app, writerId, encryptionType,
    encryptKeyHandle, responseHandler, size, offset) {
  Writable.call(this);
  this.app = app;
  this.req = req;
  this.writerId = writerId;
  this.encryptKeyHandle = encryptKeyHandle;
  this.curOffset = parseInt(offset || 0);
  this.responseHandler = responseHandler;
  this.encryptionType = encryptionType;
  this.isReadStreamClosed = false;
  this.maxSize = size;
  return this;
};

util.inherits(ImmutableDataWriter, Writable);

/*jscs:disable disallowDanglingUnderscores*/
ImmutableDataWriter.prototype._write = function(data, enc, next) {
  /*jscs:enable disallowDanglingUnderscores*/
  const self = this;
  const eventEmitter = self.req.app.get('eventEmitter');
  const uploadEvent = self.req.app.get('EVENT_TYPE').DATA_UPLOADED;
  immutableData.write(this.writerId, data)
    .then(() => {
      eventEmitter.emit(uploadEvent, data.length);
      self.curOffset += data.length;
      if (self.curOffset === self.maxSize) {
        immutableData.closeWriter(self.writerId, this.encryptionType, this.encryptKeyHandle)
          .then((dataIdHandle) => {
            this.res.set('Handle-Id', dataHanldeId);
            this.res.sendStatus(200);
          }, self.responseHandler, console.error);
      }
      next();
    }, (err) => {
      self.responseHandler(err);
    }, console.error);
};
