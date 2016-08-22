import path from 'path';
// import env from './../env';
// import { log } from './../logger/log';
import childProcess from 'child_process';
import { remote } from 'electron';
import temp from 'temp'
import fse from 'fs-extra'

const env = {
  proxyPort: 8120,
  serverPort: 8100
};

const webProxyPath = path.resolve('.', 'app', 'web_proxy.js');
const webProxyTargetPath = path.resolve('.', 'dist', 'proxy.js');
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

    // move web_proxy.js to ROOT/dist folder on non production mode
    if (process.env.NODE_ENV !== 'production') {
      fse.copySync(webProxyPath, webProxyTargetPath);
    }

    this.process = childProcess.fork(webProxyTargetPath, args);
    this.process.on('exit', function() {
      console.log('Proxy server stopped');
      remote.getGlobal('cleanUp').proxy = null;
      proxyListener.onExit('Proxy server closed');
    });
    this.process.on('message', function(event) {
      console.log('Proxy Server - onMessage event - received - ');
      console.log(event);
      event = JSON.parse(event);
      switch (event.type) {
        case 'connection':
          if (event.msg.status) {
            // log.info('Proxy server started');
            console.log('Proxy server started');
            remote.getGlobal('cleanUp').proxy = self.process.pid;
            console.log(remote.getGlobal('cleanUp'));
            return proxyListener.onStart(event.msg.data);
          }
          proxyListener.onError(event.msg);
          break;
        case 'log':
          if (event.msg.level === 'INFO') {
            // log.info(event.msg.log);
            console.log(event.msg.log);
          } else {
            // log.error(event.msg.log);
            console.log(event.msg.log);
          }
          break;
        default:
          // log.warn('Invalid event type from proxy');
          console.log('Invalid event type from proxy');
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
