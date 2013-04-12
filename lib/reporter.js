var Reporter = function(buoyClient, buildInfo) {
  return function(runner) {
    var passes = 0;
    var failures = 0;
    var total = 0;

    var results = [];

    runner.on('pass', function(test){
      passes++;
      total++;
      results.push({title: test.fullTitle(), passed: true});
    });

    runner.on('fail', function(test, err){
      failures++;
      total++;
      results.push({title: test.fullTitle(), passed: false, error: err});
    });

    runner.on('end', function(){
      console.log("["+buildInfo.version+"] Ran " + total + " tests (" + failures + " failures). Submitting results to " + buoyClient.url);
      buoyClient.report(results);
    });
  };
};

module.exports = Reporter;