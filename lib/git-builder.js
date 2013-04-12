
var EventEmitter = require('events').EventEmitter;
var spawn = require('child_process').spawn;
var gitUtils = require('./git-utils');
var _ = require('underscore');

var GitBuilder = function(options) {
  this.path = options.path;
  this.branch = options.branch || 'master';
  this.lastCommit = null;
};

GitBuilder.prototype.__proto__ = EventEmitter.prototype;

GitBuilder.prototype.start = function() {

  console.log("Generating build events when new commits are detected on the " + this.branch + " branch");

  this.interval = setInterval(function() {

    this._getLastCommit(function(err, commit) {
      if(!this.lastCommit || commit.version != this.lastCommit.version) {
        this.lastCommit = commit;
        this.emit('build', _.extend(this.lastCommit, {time: new Date(), attempt: 0}));
      }
    }.bind(this));

  }.bind(this), 3 * 1000);
};

GitBuilder.prototype.stop = function() {
  clearInterval(this.interval);
};

GitBuilder.prototype._getLastCommit = function(callback) {
  gitUtils.checkout(this.branch, function() {
    gitUtils.pull(this.branch, function() {
      gitUtils.log(function(err, output) {
        var lines = output.split("\n");
        var comment = lines.slice(3);
        comment = comment.map(function(line) {
          return line.replace(/^[\s\n]+/, '').replace(/[\n]+$/, '');
        });
        comment = comment.join("\n")
        return callback(err, {
          version: lines[0].split("commit ")[1],
          comment: comment,
          branch: this.branch
        })
      }.bind(this));
    }.bind(this))
  }.bind(this));
};

module.exports = GitBuilder;
