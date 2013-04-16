
var express = require('express');
var EventEmitter = require('events').EventEmitter;
var utils = require('./utils');

var Server = function(builder) {

  this.reports = {};
  this.builds = {};

  this.latestBuildInfo = null;
  builder.on('build', function(buildInfo) {
    this.latestBuildInfo = buildInfo;
    this.builds[buildInfo.version] = buildInfo;
  }.bind(this));
/*
  setTimeout(function() {
    this.latestBuildInfo = {version: '1', branch: 'master'}
  }.bind(this), 500);*/

  this.app = express();
  this.app.configure(function() {
    this.app.use(express.bodyParser());
    this.app.use(express.responseTime());
  }.bind(this));

  this.app.get('/builds.json', function(req, res, next) {
    var version = req.param('version');
    if(!version) { return res.json({error: "Need a version parameter to check for new builds"}) }

    var checkInterval = null;
    var checkIntervalSeconds = 0.2;
    var longPollingTimeoutSeconds = 3;
    var numChecks = 0;
    var checkBuild = function() {

      if(this.latestBuildInfo && version.toString() != this.latestBuildInfo.version) {
        checkInterval && clearInterval(checkInterval);
        return res.json(this.latestBuildInfo);
      }

      if((numChecks * checkIntervalSeconds * 1000) >= (longPollingTimeoutSeconds * 1000)) {
        checkInterval && clearInterval(checkInterval);
        return res.json({}); // Reconnect and check again
      }

      numChecks++;
    }.bind(this);

    checkBuild();
    checkInterval = setInterval(checkBuild.bind(this), checkIntervalSeconds * 1000);
  }.bind(this));

  this.app.post('/reports.json', function(req, res, next) {
    var report = {};
    report.version = req.body.version;
    report.environment = req.body.environment && JSON.parse(req.body.environment);
    report.results = JSON.parse(req.body.results);
    report.build = this.builds[report.version];

    this.processReport(report);
    
    return res.json({});
  }.bind(this))

  this.app.get('/reports.json', function(req, res, next) {
    return res.json(this.reports);
  }.bind(this));

};

Server.prototype.__proto__ = EventEmitter.prototype;

Server.prototype.processReport = function(report) {
  
  //console.log(JSON.stringify(report.results))
  //console.log("Received test report version=" + report.version + ", environment="+JSON.stringify(report.environment));

  report.passed = true;
  report.numPassed = 0;
  report.numFailed = 0;
  report.numTests = 0;
  report.results.forEach(function(test) {
    if(!test.passed) {
      report.passed = false;
      report.numFailed++;
    } else {
      report.numPassed++;
    }
    report.numTests++;
  });

  if(!this.reports[report.version]) {
    this.reports[report.version] = [];
  }
  this.reports[report.version].push(report);

  if(report.passed) {
    console.log(utils.summarizeReport(report));
    this.emit('environment-passed', report);
  } else {
    console.log(utils.summarizeReport(report));
    this.emit('environment-failed', report);
  }

};

module.exports = Server;
