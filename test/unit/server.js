
var Server = require('./../../lib/index').Server;
var assert = require('assert');
var request = require('supertest');
var EventEmitter = require('events').EventEmitter;

var MockBuilder = function() {
};

MockBuilder.prototype.__proto__ = EventEmitter.prototype;

var successReport = {
  "version":"V1",
  "environment":{"environment":"node","version":"v0.8.17","platform":"darwin","arch":"x64"},
  "results":[
    {
      "title":"Test A",
      "passed":true,
      "duration":0,
      "timedOut":false,
      "namespace":["MyParent"]
    },
    {
      "title":"Test B",
      "passed":true,
      "duration":40,
      "timedOut":false,
      "namespace":["MyParent"]
    }
  ]
}

var failureReport = {
  "version":"V2",
  "environment":{"environment":"node","version":"v0.8.17","platform":"darwin","arch":"x64"},
  "results":[
    {
      "title":"Test A",
      "passed":true,
      "duration":0,
      "timedOut":false,
      "namespace":["MyParent"]
    },
    {
      "title":"Test B",
      "passed":false,
      "error":{"name":"AssertionError","actual":100,"expected":90,"operator":"=="},
      "duration":40,
      "timedOut":false,
      "namespace":["MyParent"]
    }
  ]
}

describe("Server", function() {

  it("should give me a new build version through long polling", function(done) {
    var mockBuilder = new MockBuilder();
    var server = new Server(mockBuilder);
    mockBuilder.emit('build', {version: 4})
    request(server.app)
      .get('/builds.json?version=3')
      .expect(200)
      .end(function(err, res) {
        var result = JSON.parse(res.text);
        assert.equal(4, result.version);
        done();
      })  
  });

  it("should have a call to retrieve reports", function(done) {
    var mockBuilder = new MockBuilder();
    var server = new Server(mockBuilder);
    request(server.app)
      .get('/reports.json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        var result = JSON.parse(res.text);
        assert.equal(0, Object.keys(result).length);
        done();
      })  
  });

  it("should emit process a successful report properly", function(done) {
    var mockBuilder = new MockBuilder();
    var server = new Server(mockBuilder);
    server.on('environment-passed', function(report) {
      assert.equal(report.version, successReport.version);
      done();
    });
    server.processReport(successReport);
  });

});
