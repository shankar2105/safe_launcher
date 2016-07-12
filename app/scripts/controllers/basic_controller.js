/**
 * Basic Controller
 */
window.safeLauncher.controller('basicController', [ '$scope', '$state', '$rootScope', '$interval', 'serverFactory', 'CONSTANTS',
  function($scope, $state, $rootScope, $interval, server, CONSTANTS) {
    // handle proxy localy
    var setProxy = function(status) {
      window.localStorage.setItem('proxy', JSON.stringify({status: Boolean(status)}));
    };
    var getProxy = function() {
      return JSON.parse(window.localStorage.getItem('proxy'));
    };
    var clearProxy = function() {
      window.localStorage.clear();
    };

    // handle server error
    server.onServerError(function(err) {
      console.log(err);
      // TODO show loader
      $rootScope.$alert.show($rootScope.ALERT_TYPE.PROMPT, {
        title: 'Server Error',
        msg: err.message
      }, function(err, data) {
        server.closeWindow();
      });
    });

    // handle server start
    server.onServerStarted(function() {
      console.log('Server started');
    });

    // handle server shutdown
    server.onServerShutdown(function() {
      // $rootScope.$loader.hide();
      console.log('Server Stopped');
    });

    // handle proxy start
    server.onProxyStart(function(msg) {
      $rootScope.$proxyServer = true;
      setProxy(true);
      $rootScope.$alert.show($rootScope.ALERT_TYPE.TOASTER, {
        msg: 'Proxy Server started',
        hasOption: false,
        isError: false
      }, function(err, data) {
        console.log('Proxy Server started');
      });
    });

    // handle proxy stop
    server.onProxyExit(function(msg) {
      // $rootScope.$loader.hide();
      $rootScope.$proxyServer = false;
      setProxy(false);
      console.log(msg);
    });

    // handle proxy error
    server.onProxyError(function(err) {
      setProxy(false);
      $rootScope.$proxyServer = false;
      $rootScope.$alert.show($rootScope.ALERT_TYPE.TOASTER, {
        msg: err.message,
        hasOption: false,
        isError: true
      }, function(err, data) {
        console.log(data);
        server.closeWindow();
      });
      console.log(err);
    });

    var updateActivity = function(data) {
      var logKeys = Object.keys($rootScope.logList);
      if (logKeys.length >= CONSTANTS.LOG_LIST_LIMIT) {
        var lastkey = logKeys.pop();
        delete $rootScope.logList[lastkey];
      }
      if (!data.app) {
        return;
      }
      data.activity['name'] = $rootScope.appList[data.app].name;
      $rootScope.logList[data.activity.activityId] = data.activity;
      if ($rootScope.currentAppDetails) {
        $rootScope.currentAppDetails['logs'][data.activity.activityId] = data.activity;
      }
      $rootScope.appList[data.app].status = data.activity;
    };

    server.onNewAppActivity(function(data) {
      if (!data) {
        return;
      }
      console.log(data);
      updateActivity(data);
    });

    server.onUploadEvent(function(data) {
      if (!data) {
        return;
      }
      console.log(data);
      $rootScope.dashData.upload += data;
    });

    server.onDownloadEvent(function(data) {
      if (!data) {
        return;
      }
      console.log(data);
      $rootScope.dashData.download += data;
    });

    server.onUpdatedAppActivity(function(data) {
      if (!data) {
        return;
      }
      console.log(data);
      updateActivity(data);
    });
    var completeCount = 0;
    var collectedData = {
      GET: {
        oldVal: 0,
        newVal: 0
      },
      POST: {
        oldVal: 0,
        newVal: 0
      },
      PUT: {
        oldVal: 0,
        newVal: 0
      },
      DELETE: {
        oldVal: 0,
        newVal: 0
      }
    };

    var onComplete = function(target, oldVal, newVal) {
      collectedData[target]['oldVal'] = oldVal;
      collectedData[target]['newVal'] = newVal;
      var temp = {};
      if (completeCount === 4) {
        temp.GET = collectedData.GET.newVal - collectedData.GET.oldVal;
        temp.POST = collectedData.POST.newVal - collectedData.POST.oldVal;
        temp.PUT = collectedData.PUT.newVal - collectedData.PUT.oldVal;
        temp.DELETE = collectedData.DELETE.newVal - collectedData.DELETE.oldVal;
        completeCount = 0;
        $rootScope.dashData.authHTTPMethods.push(temp);
        if ($rootScope.dashData.authHTTPMethods.length > 50) {
          $rootScope.dashData.authHTTPMethods.splice(0, 1);
        }
        $rootScope.$applyAsync();
      }
    };
    $interval(function() {
      if (!$rootScope.isAuthenticated) {
        return server.fetchGetsCount(function(err, data) {
          if (err) {
            return;
          }
          $rootScope.dashData.unAuthGET.push(data - $rootScope.dashData.getsCount);
          $rootScope.dashData.getsCount = data;
          if ($rootScope.dashData.unAuthGET.length > 50) {
            $rootScope.dashData.unAuthGET.splice(0, 1);
          }
          $rootScope.$applyAsync();
        });
      }
      server.fetchGetsCount(function(err, data) {
        if (err) {
          return;
        }
        completeCount++;
        onComplete('GET', $rootScope.dashData.getsCount, data);
        $rootScope.dashData.getsCount = data;
      });
      server.fetchDeletesCount(function(err, data) {
        if (err) {
          return;
        }
        if ($rootScope.isAuthenticated) {
          completeCount++;
          onComplete('DELETE', $rootScope.dashData.deletesCount, data);
        }
        $rootScope.dashData.deletesCount = data;
      });
      server.fetchPostsCount(function(err, data) {
        if (err) {
          return;
        }
        completeCount++;
        onComplete('POST', $rootScope.dashData.postsCount, data);
        $rootScope.dashData.postsCount = data;
      });
      server.fetchPutsCount(function(err, data) {
        if (err) {
          return;
        }
        completeCount++;        
        onComplete('PUT', $rootScope.dashData.putsCount, data);
        $rootScope.dashData.putsCount = data;
      });
      for (var i in $rootScope.appList) {
        var item = $rootScope.appList[i];
        $rootScope.appList[i].lastActive = window.moment(item.status.endTime || item.status.beginTime).fromNow(true)
      }
    }, CONSTANTS.FETCH_DELAY);

    window.msl.setNetworkStateChangeListener(function(state) {
      $rootScope.$networkStatus.show = true;
      $rootScope.$networkStatus.status = state;
      if ($rootScope.$networkStatus.status === 1) {
        $rootScope.$alert.show($rootScope.ALERT_TYPE.TOASTER, {
          msg: 'Network connected',
          hasOption: false,
          isError: false
        }, function(err, data) {
          console.log(data);
        });
      }
      if ($rootScope.$networkStatus.status === window.NETWORK_STATE.DISCONNECTED) {
        $rootScope.$alert.show($rootScope.ALERT_TYPE.TOASTER, {
          msg: 'Network Error',
          hasOption: true,
          isError: true,
          opt: {
            name: "Retry Now",
            err: null,
            data: true
          }
        }, function(err, data) {
          server.reconnectNetwork();
        });
      }
      console.log('Network status :: ' + state);
      $rootScope.$applyAsync();
    });

    var proxyListener = function(status) {
      $rootScope.$proxyServer = status;
    };

    $scope.toggleProxyServer = function() {
      $rootScope.$proxyServer = !$rootScope.$proxyServer;
      if (!$rootScope.$proxyServer) {
        return server.stopProxyServer();
      }
      server.startProxyServer(proxyListener);
    };

    $scope.enableProxySetting = function(status) {
      setProxy(status);
      $rootScope.$proxyServer = Boolean(status);
      $state.go('app');
    };

    $scope.checkProxy = function() {
      var proxy = getProxy();
      if (proxy && proxy.hasOwnProperty('status')) {
        $rootScope.$proxyServer = proxy.status;
        return $state.go('app');
      }
      $state.go('splash');
    }

    // initialize application
    server.start();
  }
]);
