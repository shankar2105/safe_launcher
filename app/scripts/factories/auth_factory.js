/**
 * Authentication Factory
 */
window.safeLauncher.factory('authFactory', [ 'serverFactory',
  function(server) {
    var self = this;

    // Login
    self.login = function(user, callback) {
      window.msl.login(user.pin, user.keyword, user.password, function(err) {
        if (err) {
          return callback(err);
        }
        window.msl.dropUnregisteredClient(callback);
      });
    };

    // Register
    self.register = function(user, callback) {
      window.msl.register(user.pin, user.keyword, user.password, callback);
    };

    self.onAuthorisationReq = server.onAuthRequest;
    self.confirmAuthorisation = server.confirmResponse;

    return self;
  }
]);
