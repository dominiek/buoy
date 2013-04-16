
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

