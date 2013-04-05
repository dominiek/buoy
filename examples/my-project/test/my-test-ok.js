
var assert = require('assert');

describe("MyTestOk", function() {

  it("will assert something", function() {
    assert.equal(100, 10*10);
  });

  it("will assert something asynchronously", function(done) {
    setTimeout(function() {
      assert.equal(100, 10*10);
      done();
    }, 200);
  });

});
