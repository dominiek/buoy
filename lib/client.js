
var request = require('request');
var EventEmitter = require('events').EventEmitter;
var gitUtils = require('./git-utils');

var Client = function(options) {
  this.url = options.url;
  this.options = options;
  this.currentBuildInfo = {version: 'none'};
  this.reconnectIntervalSeconds = 3;
  this.environment = {
    environment: 'node',
    version: process.version,
    platform: process.platform,
    arch: process.arch
  }
};

Client.prototype.__proto__ = EventEmitter.prototype;

Client.prototype.connect = function(callback) {
  this._getBuilds();
  return callback && callback();
};

Client.prototype.report = function(results, callback) {
  request({
    method: 'POST',
    uri: this.url + '/reports.json',
    form: {
      version: this.currentBuildInfo.version, 
      results: JSON.stringify(results),
      environment: JSON.stringify(this.environment),
    }
  }, callback);
};

Client.prototype._setBuildEnvironment = function(callback) {
  if(!this.currentBuildInfo || !this.currentBuildInfo.branch) { return callback(); }
  gitUtils.checkout(this.currentBuildInfo.branch, function() {
    gitUtils.pull(this.currentBuildInfo.branch, function() {
      callback && callback();
    }.bind(this));
  }.bind(this));
};

Client.prototype._getBuilds = function() {
  request({
    method: 'GET',
    uri: this.url + '/builds.json?version=' + this.currentBuildInfo.version 
  }, function(err, response) {
    if(err || response.statusCode != 200) {
      console.log("err: ", err)
      console.warn("Could not connect to " + this.url + ": " + (err ? err.message : response.statusCode) + " (Retrying in " + this.reconnectIntervalSeconds + " seconds)");
      setTimeout(this._getBuilds.bind(this), this.reconnectIntervalSeconds * 1000);
    } else {
      setTimeout(this._getBuilds.bind(this), 100)
      var buildInfo = JSON.parse(response.body);
      if(buildInfo && buildInfo.version && buildInfo.version != this.currentBuildInfo.version) {
        this.currentBuildInfo = buildInfo;
        this._setBuildEnvironment(function() {
          this.emit('test', this.currentBuildInfo);
        }.bind(this));
      }
    }
  }.bind(this));
};

module.exports = Client;
