import path from 'path';
// import env from './../env';
// import { log } from './../logger/log';
import childProcess from 'child_process';
import { remote } from 'electron';

const env = {
  proxyPort: 8120,
  serverPort: 8100
};

class ProxyController {

  constructor() {
    this.process = null;
  }

  start(proxyListener) {
    if (this.process) {
      console.log('Trying to start proxy server which is already running');
      // log.warn('Trying to start proxy server which is already running');
      return;
    }
    let self = this;
    console.log('Starting proxy server');
    var args = [
      '--proxyPort',
      env.proxyPort,
      '--serverPort',
      env.serverPort
    ];
    if (remote.getGlobal('proxyUnsafeMode')) {
      args.push('--unsafe_mode');
      args.push('true');
    }
    console.log(path.resolve('.', 'dist', 'proxy.js'));
    this.process = childProcess.fork(path.resolve('.', 'dist', 'proxy.js'), args);
    this.process.on('exit', function() {
      console.log('Proxy server stopped');
      remote.getGlobal('cleanUp').proxy = null;
      proxyListener.onExit('Proxy server closed');
    });
    this.process.on('message', function(event) {
      console.log('Proxy Server - onMessage event - received - ');
      event = JSON.parse(event);
      switch (event.type) {
        case 'connection':
          if (event.msg.status) {
            // log.info('Proxy server started');
            console.log('Proxy server started');
            remote.getGlobal('cleanUp').proxy = self.process.pid;
            return proxyListener.onStart(event.msg.data);
          }
          proxyListener.onError(event.msg);
          break;
        case 'log':
          if (event.msg.level === 'INFO') {
            // log.info(event.msg.log);
          } else {
            // log.error(event.msg.log);
          }
          break;
        default:
          // log.warn('Invalid event type from proxy');
      }
    });
  }

  stop() {
    if (!this.process) {
      return;
    }
    // log.info('Stopping proxy server');
    this.process.kill();
    this.process = null;
  }
}

export let proxyController = new ProxyController();
