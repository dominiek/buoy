
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var utils = require('./../utils');
var request = require('request');

var FlowdockNotifier = function(options) {
  this.token = options.token;
};

FlowdockNotifier.prototype.__proto__ = EventEmitter.prototype;

FlowdockNotifier.prototype.enable = function(server) {
  console.log("Notifying results to Flowdock chat " + this.token);
  server.on('environment-failed', function(report) {
    this._speak(utils.summarizeReport(report));
    setTimeout(function() {
      this._paste(utils.summarizeErrors(report, {numLines: 2}));
    }.bind(this), 500);
  }.bind(this));
  server.on('environment-passed', function(report) {
    this._speak(utils.summarizeReport(report));
  }.bind(this));
};

FlowdockNotifier.prototype._speak = function(message) {
  request.post({
    'uri': 'https://api.flowdock.com/v1/messages/chat/'+this.token,
    'form': {
      'event': 'message',
      'content': message,
      'external_user_name': 'Buoy'
    }
  }, function(err, res) {
    if(err) { console.warn('Flowdock error: ', err); }
    if(res.statusCode != 200) { console.warn('Flowdock error: ', res.body); }
  });
};

FlowdockNotifier.prototype._paste = function(text) {
  var lines = text.split("\n");
  lines = lines.map(function(line) { return '  '+ line; });
  this._speak(lines.join("\n"));
};

module.exports = FlowdockNotifier;
