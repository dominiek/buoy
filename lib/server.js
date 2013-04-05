
var express = require('express');

var Server = function() {

  this.app = express();
  this.app.configure(function() {
    this.app.use(express.bodyParser());
    this.app.use(express.responseTime());
  }.bind(this))

  this.app.get('/reports.json', function(req, res, next) {
    return res.json({result: []});
  });

};

module.exports = Server;
