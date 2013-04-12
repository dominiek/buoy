
var spawn = require('child_process').spawn;

exports.exec = function(args, callback) {
  var output = '';
  var cmd = spawn('git', args);
  cmd.stdout.on('data', function (data) {
    output += data;
  });
  cmd.on('close', function() {
    return callback(null, output);
  })
};

exports.checkout = function(branchName, callback) {
  exports.exec(['checkout', branchName], callback);
};

exports.pull = function(branchName, callback) {
  exports.exec(['pull', 'origin', branchName], callback);
};

exports.log = function(callback) {
  exports.exec(['log', '-n', '1'], callback)
};
