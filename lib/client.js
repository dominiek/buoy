
var request = require('request');
var EventEmitter = require('events').EventEmitter;

var Client = function(options) {
  this.url = options.url;
  this.options = options;
};

Client.prototype.__proto__ = EventEmitter.prototype;

Client.prototype.connect = function(callback) {
  this.emit('test', {version: Math.random()});
  setInterval(function() {
    this.emit('test', {version: Math.random()});
  }.bind(this), 4000);
  return callback && callback();
};

module.exports = Client;
