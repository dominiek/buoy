
var assert = require('assert');
var utils = require('./../../lib/utils');

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
  ],
  "numFailed": 1,
  "numPassed": 1,
  "numTests": 2,
  "build":{"version":"V2","comment":"\nBump and grunt script\n","branch":"master","time":"2013-04-16T13:07:41.825Z","attempt":0}
}

describe("Utils", function() {

  it("should properly summarize a report", function() {

    var summary = utils.summarizeReport(failureReport);
    assert(summary.match(/node/))
    assert(summary.match(/FAILED/))
    assert(!summary.match(/commit/i))

    failureReport.build.commitUrl = 'http://aaa'
    var summary = utils.summarizeReport(failureReport);
    assert(summary.match(/commit/i))

  });

});
