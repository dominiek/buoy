
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
