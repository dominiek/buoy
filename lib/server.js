
var express = require('express');

var Server = function(builder) {

  var latestBuildInfo = null;
  builder.on('build', function(buildInfo) {
    latestBuildInfo = buildInfo;
  });

  var reports = [];

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

      if(latestBuildInfo && version.toString() != latestBuildInfo.version) {
        checkInterval && clearInterval(checkInterval);
        return res.json(latestBuildInfo);
      }

      if((numChecks * checkIntervalSeconds * 1000) >= (longPollingTimeoutSeconds * 1000)) {
        checkInterval && clearInterval(checkInterval);
        return res.json({}); // Reconnect and check again
      }

      numChecks++;
    };

    checkBuild();
    checkInterval = setInterval(checkBuild, checkIntervalSeconds * 1000);
  });

  this.app.post('/reports.json', function(req, res, next) {
    var report = {};
    report.version = req.body.version;
    report.environment = req.body.environment && JSON.parse(req.body.environment);
    report.results = JSON.parse(req.body.results);

    reports.push(report);

    console.log("Received test report version=" + report.version + ", environment="+JSON.stringify(report.environment));
    
    return res.json({});
  })

  this.app.get('/reports.json', function(req, res, next) {
    return res.json({result: []});
  });

};

module.exports = Server;
