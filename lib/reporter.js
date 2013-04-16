var Reporter = function(buoyClient, buildInfo) {
  return function(runner) {
    var passes = 0;
    var failures = 0;
    var total = 0;

    var results = [];

    var getNamespace = function(parent) {
      var namespace = [];

      if(parent.title) {
        namespace.push(parent.title); 
      }
      if(parent.parent && parent.parent.title) {
        namespace.push(parent.parent.title); 
      }

      return namespace.reverse();
    };

    runner.on('pass', function(test){
      passes++;
      total++;
      results.push({
        title: test.fullTitle(), 
        passed: true,
        duration: test.duration, 
        timedOut: test.timedOut,
        namespace: getNamespace(test.parent)
      });
    });

    runner.on('fail', function(test, err){
      failures++;
      total++;

      var error = {
        name: err.name,
        stack: err.stack,
        actual: err.actual,
        expected: err.expected,
        operator: err.operator
      };
      results.push({
        title: test.fullTitle(), 
        passed: false, 
        error: error,
        duration: test.duration, 
        timedOut: test.timedOut,
        namespace: getNamespace(test.parent)
      });
    });

    runner.on('end', function(){
      console.log("End");
      console.log("["+buildInfo.version+"] Ran " + total + " tests (" + failures + " failures). Submitting results to " + buoyClient.url);
      buoyClient.report(results);
    });
  };
};

module.exports = Reporter;