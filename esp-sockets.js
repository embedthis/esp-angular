/*
    esp-sockets.js - Web Sockets
 */

angular.module('esp.sockets', [])
.factory('Sockets', function(Esp, $location, $rootScope, $http, $timeout) {

    function Sockets(uri, onSuccess, onError, options) {
        if (!window.WebSocket) {
            console.log("Sockets: Browser lacks web sockets, resort to polling");
            throw "No WebSockets";
        }
        this.uri = uri;
        this.scope = $rootScope.$new(true);
        this.onSuccess = onSuccess;
        this.onError = onError;
        this.options = options || {};
        this.options.dialect = this.options.dialect || ['chat'];
        return this;
    };

    Sockets.prototype = {
        start: function(uri, onSuccess, onError, options) {
            this.stop();
            var uri;
            if (this.uri.indexOf(':') > 0) {
                uri = this.uri;
            } else {
                var proto = $location.protocol() == 'https' ? 'wss' : 'ws'
                uri = proto + '://' + $location.host() + ':' + $location.port() + Esp.config.server + this.uri;
            }
            console.log("Sockets: start", uri);
            var ws = new WebSocket(uri, this.options.dialect);
            this.ws = ws;
            this.streaming = true;
            var self = this;

            ws.onmessage = function (event) {
                console.log("Sockets: data: ", event.data);
                angular.forEach(event.data, function(value, key) {
                    if (key == 'feedback') {
                        $rootScope[key] = value;
                    }
                });
                self.scope.$apply(function() {
                    Esp.access();
                    self.onSuccess(angular.fromJson(event.data));
                });
            };
            ws.onclose = function (event) {
                console.log("Sockets: close event " + event);
                if (event.code != 1000) {
                    if (self.onError) {
                        self.onError(event);
                    }
                } 
                if ($location.path() == this.page) {
                    if (this.streaming) {
                        /* Delay to stop busy-looping */
                        var self = this;
                        $timeout(function() { self.start(); }, 1 * 1000, true);
                    }
                }
            };
            /*
                Listen to location change events for a navigation away from this page
                Store the listen handle (deregistration function) in off
             */
            self.page = $location.path();
            var off = $rootScope.$on("$locationChangeSuccess", function(scope, current, previous) {
                /* Cancel the listening */
                off();
                self.stop();
            });
        },

        stop: function() {
            if (this.ws) {
                console.log("Sockets: stop");
                try { this.ws.close(); } catch (e) {};
                this.ws = null;
                this.streaming = false;
            }
        },

        toggle: function() {
            this.streaming = !this.streaming;
            if (this.streaming) {
                this.start();
            } else {
                this.stop();
            }
        },

    };

    return {
        connect: function(uri, onSuccess, onError, options) {
            var sockets = new Sockets(uri, onSuccess, onError, options);
            sockets.start();
            return sockets;
        }
    };
});


