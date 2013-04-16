
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
      "error":{
        "name":"AssertionError",
        "actual":100,
        "expected":90,
        "operator":"==",
        "stack": "AssertionError: 100 == 90\n    at Context.<anonymous> (/Users/dodo/checkouts/buoy/examples/my-project/test/my-test-fail.js:7:12)\n    at Test.Runnable.run (/Users/dodo/checkouts/buoy/node_modules/mocha/lib/runnable.js:213:32)\n    at Runner.runTest (/Users/dodo/checkouts/buoy/node_modules/mocha/lib/runner.js:351:10)\n    at Runner.runTests.next (/Users/dodo/checkouts/buoy/node_modules/mocha/lib/runner.js:397:12)\n    at next (/Users/dodo/checkouts/buoy/node_modules/mocha/lib/runner.js:277:14)\n    at Runner.hooks (/Users/dodo/checkouts/buoy/node_modules/mocha/lib/runner.js:286:7)\n    at next (/Users/dodo/checkouts/buoy/node_modules/mocha/lib/runner.js:234:23)\n    at Runner.hook (/Users/dodo/checkouts/buoy/node_modules/mocha/lib/runner.js:254:5)\n    at process.startup.processNextTick.process._tickCallback (node.js:244:9)"
      },
      "duration":40,
      "timedOut":false,
      "namespace":["MyParent"]
    },
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


  it("should generate error report", function() {

    var errorSummary = utils.summarizeErrors(failureReport);
    assert(errorSummary.match(/AssertionError/i))
    assert(errorSummary.match(/MyParent/i))
    assert(errorSummary.match(/checkouts/i))

  });

});
