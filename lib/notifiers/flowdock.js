
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var utils = require('./../utils');
var request = require('request');

var FlowdockNotifier = function(options) {
  this.token = options.token;
  this.fromAddress = options.fromAddress;
};

FlowdockNotifier.prototype.__proto__ = EventEmitter.prototype;

FlowdockNotifier.prototype.enable = function(server) {
  console.log("Notifying results to Flowdock chat " + this.token);
  server.on('environment-failed', function(report) {
    this._send(utils.summarizeReport(report), utils.summarizeErrors(report, {numLines: 15, html: true}), {tags: 'failed'});
  }.bind(this));
  server.on('environment-passed', function(report) {
    var subject = utils.summarizeReport(report, {short: true});
    var content = report.numPassed + " " + utils.pluralize("tests", report.numPassed) + " passed";
    this._send(subject, content, {tags: 'passed'});
  }.bind(this));
};

FlowdockNotifier.prototype._send = function(subject, content, options) {
  if(!options) { options = {}; }
  request.post({
    'uri': 'https://api.flowdock.com/v1/messages/team_inbox/'+this.token,
    'form': _.extend(options, {
      'source': 'Buoy',
      'from_address': this.fromAddress,
      'subject': subject,
      'content': content
    })
  }, function(err, res) {
    if(err) { console.warn('Flowdock error: ', err); }
    if(res.statusCode != 200) { console.warn('Flowdock error: ', res.body); }
  });
};

FlowdockNotifier.prototype._paste = function(text) {
  var lines = text.split("\n");
  lines = lines.map(function(line) { return '  '+ line; });
  this._send(lines.join("\n"));
};

module.exports = FlowdockNotifier;
