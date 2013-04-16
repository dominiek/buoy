
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var Campfire = require("campfire").Campfire;
var utils = require('./../utils');

var CampfireNotifier = function(options) {
  this.subdomain = options.subdomain;
  this.token = options.token;
  this.room = options.room;
  this.client = require("ranger").createClient(this.subdomain, this.token);
};

CampfireNotifier.prototype.__proto__ = EventEmitter.prototype;

CampfireNotifier.prototype.enable = function(server) {
  console.log("Notifying results to Campfire chat room " + this.room + " on " + this.subdomain + ".bottlenose.com");
  server.on('environment-failed', function(report) {
    var msg = "[Buoy] FAILED (" + report.numFailed + " out of " + report.numTests + " " + utils.pluralize("tests", report.numTests) + " failed), Branch: "+report.build.branch+", Environment: " + utils.humanReadableEnvironmentString(report.environment)
    this._speak(msg);
    //this._play('deeper');
  }.bind(this));
  server.on('environment-passed', function(report) {
    var msg = "[Buoy] OK (" + report.numPassed + " " + utils.pluralize("tests", report.numPassed) + " passed), Branch: "+report.build.branch+", Environment: " + utils.humanReadableEnvironmentString(report.environment)
    this._speak(msg);
  }.bind(this));
};

CampfireNotifier.prototype._speak = function(message) {
  this._getRoom(function(err, room) {
    room.speak(message);
  });
};

CampfireNotifier.prototype._play = function(sound) {
  this._getRoom(function(err, room) {
    room.play(sound);
  });
};

CampfireNotifier.prototype._getRoom = function(callback) {
  if(this.roomObject) { return callback(null, this.roomObject); }
  this.client.rooms(function (rooms) { 
    rooms.forEach(function(room) {
      if(!this.room) {
        this.roomObject = room;
        return;
      }
      if(this.room.toString() == room.id.toString()) {
        this.roomObject = room;
        return;
      }
      if(this.room.toString() == room.name.toString()) {
        this.roomObject = room;
        return;
      }
      console.log(this.room, room.name)
    }.bind(this));

    if(!this.roomObject) {
      console.warn("Could not find any room matching " + this.room);
    }

    return callback(null, this.roomObject); 
  }.bind(this));
};

module.exports = CampfireNotifier;
