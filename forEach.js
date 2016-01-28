var ensure = require('./ensure');
var type = require('./type');
var callOnce = require('./callOnce');
var _ = require('lodash');

function forEach (array, doThis, done) {

  if (type(array) === 'object')
    return forEachPair(_.pairs(array), doThis, done);

  ensure(array, 'array')
    .and(doThis, 'function');

  if (array.length && doThis) {
    return setTimeout(function() {
      doThis(array[0], forEach.bind(this, array.slice(1), doThis, done));
    },0);
  }

  if (done) return done();
}

forEach.parallel = function (array, doThis, done) {

  ensure(array, 'array')
    .and(doThis, 'function');

  var totalToDo = array.length;

  if (!totalToDo) return done ? done() : true;

  function onComplete() {
    if (!--totalToDo) return done ? done() : true;
  }

  for (var i in array) {
    doThis(array[i], callOnce(onComplete), i);
  }
};

forEach.multi = function(max) {

  return function (array, doThis, done) {

    // Do nothing after
    if (done === undefined) done = function(){return true;};

    done = callOnce(done);

    var remaining = array.length;
    var total = array.length;

    // List is empty, finish early!
    if (!remaining) return done();

    // Number of functions active
    var active = 0;

    // Position in array that we've done so far
    var counter = 0;

    // Call the first X functions
    while (active < max) {
      run();active++;
    }

    function run () {

      var i = counter;

      // No more to do
      if (i >= total) return;

      counter++;

      setTimeout(function(){

        // call once people!
        doThis(array[i], callOnce(onComplete));
      }, 0);
    }

    function onComplete() {
      if (!--remaining) {
        return done();
      }
      run();
    }
  };
};

function forEachPair (array, doThis, done) {

  ensure(array, 'array')
    .and(doThis, 'function');

  if (array.length && doThis) {
    return setTimeout(function() {
      doThis(array[0][0], array[0][1], forEachPair.bind(this, array.slice(1), doThis, done));
    },0);
  }

  if (done) return done();
}

module.exports = forEach;