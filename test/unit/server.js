
var Server = require('./../../lib/index').Server;
var assert = require('assert');
var request = require('supertest');

describe("Server", function() {

  it("should have a call to retrieve reports", function(done) {
    var server = new Server();
    request(server.app)
      .get('/reports.json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        var result = JSON.parse(res.text).result;
        assert.equal(0, result.length);
        done();
      })  
  });

});
