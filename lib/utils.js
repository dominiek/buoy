
exports.humanReadableEnvironmentString = function(environment) {
  var str = environment.environment + " " + environment.version;
  if(environment.platform) {
    str += " ("+environment.platform+"/"+environment.arch+")";
  }
  return str;
};

exports.pluralize = function(word, num) {
  if(num == 1) { return word.slice(-1); }
  return word;
};

exports.summarizeReport = function(report) {
  var msg = "";
  if(!report.passed) {
    msg += "[Buoy] FAILED (" + report.numFailed + " out of " + report.numTests + " " + exports.pluralize("tests", report.numTests) + " failed)";
  } else {
    msg += "[Buoy] OK (" + report.numPassed + " " + exports.pluralize("tests", report.numPassed) + " passed)";
  }
  if(report.build && report.build.branch) {
    msg += ", Branch: "+report.build.branch;
  }
  if(report.build && report.build.commitUrl) {
    msg += ", Last commit: "+report.build.commitUrl;
  }
  msg += ", Environment: " + exports.humanReadableEnvironmentString(report.environment);
  return msg;
};


exports.pad = function(str, len) {
  str = String(str);
  return Array(len - str.length + 1).join(' ') + str;
};

exports.summarizeErrors = function(report, options) {
  if(!options) { options = {}; }
  var summary = '';
  var namespaces = {};
  report.results.forEach(function(test) {
    if(!test.passed) {
      var namespace = test.namespace && test.namespace.length ? test.namespace.join(' ') : '';
      if(!namespaces[namespace]) {
        namespaces[namespace] = [];
      }
      namespaces[namespace].push(test);
    }
  });
  for(var path in namespaces) {
    var testSummary = "";
    var tests = namespaces[path];
    tests.forEach(function(test, i) {
      testSummary += (i+1) + ") " + path + " " + test.title + ":\n"
      if(test.error.stack) {
        var lines = test.error.stack.split("\n");
        if(options.numLines) {
          lines = lines.slice(0, options.numLines);
        }
        lines.forEach(function(line) {
          testSummary += "  " + line + "\n";
        });
      }
    });
    summary += testSummary + "\n";
  }
  return summary;
};
