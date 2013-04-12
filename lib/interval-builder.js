
var EventEmitter = require('events').EventEmitter;

var IntervalBuilder = function(options) {
  this.intervalSeconds = options.interval || 60;
};

IntervalBuilder.prototype.__proto__ = EventEmitter.prototype;

IntervalBuilder.prototype.start = function() {

  console.log("Generating build events every " + this.intervalSeconds + " seconds");

  this.interval = setInterval(function() {
    var date = new Date();
    this.emit('build', {version: date-0, time: date});
  }.bind(this), this.intervalSeconds * 1000);
};

IntervalBuilder.prototype.stop = function() {
  clearInterval(this.interval);
}

module.exports = IntervalBuilder;
