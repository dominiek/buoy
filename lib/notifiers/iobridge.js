
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var utils = require('./../utils');
var request = require('request');

var IobridgeNotifier = function(options) {
  this.lcdId = options.lcdId;
  this.relaisIds = options.relaisId ? options.relaisId.split(',') : [];
  this.soundId = options.soundId;
};

IobridgeNotifier.prototype.__proto__ = EventEmitter.prototype;

IobridgeNotifier.prototype.enable = function(server) {
  console.log("Notifying results to IOBridge");
  server.on('environment-failed', function(report) {
    this._setWidgets(true, report.numFailed);
  }.bind(this));
  server.on('environment-passed', function(report) {
    this._setWidgets(false, 0);
  }.bind(this));
};

IobridgeNotifier.prototype._setWidgets = function(hadFailures, numFailures) {
  if(this.soundId) {
    this._setSound(this.soundId, hadFailures ? 100 : 10);
  }
  for(var i=0; this.relaisIds.length>i; i++) {
    var value = 0;
    if(i == 0) {
      this._setRelais(this.relaisIds[i], hadFailures ? 0 : 1, i);
    }
    if(i == 1) {
      this._setRelais(this.relaisIds[i], hadFailures ? 1 : 0, i);
    }
  }
  if(this.lcdId) {
    var s2 = (numFailures != 1) ? 's' : '';
    this._setLcd(this.lcdId, hadFailures ? numFailures+' failure'+s2 : 'All tests OK')
  }
};

IobridgeNotifier.prototype._setSound = function(id, duration) {
  this._execute('http://www.iobridge.com/widgets/static/id='+id+'&value='+duration+'&format=json');
};

IobridgeNotifier.prototype._setRelais = function(id, value, i) {
  setTimeout(function() { 
    this._execute('http://www.iobridge.com/widgets/static/id='+id+'&value='+value+'&format=json');
  }.bind(this), i*3000);
};

IobridgeNotifier.prototype._setLcd = function(id, text) {
  this._execute('http://www.iobridge.com/widgets/static/id='+id+'&value=%FEC'+encodeURIComponent(text)+'&format=json')
};

IobridgeNotifier.prototype._execute = function(url) {
  request.get({
    uri: url,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }, function(response) {
  });
};

module.exports = IobridgeNotifier;
