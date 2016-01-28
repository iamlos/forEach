var ensure = require('./ensure');
var type = require('./type');
var callOnce = require('./callOnce');
var _ = require('lodash');

// how can we expand this to have error handling?

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


// (function tests() {

//   var each = forEach.multi(2);

//   var list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];

//   console.log('here');

//   each(list, function(num, next){

//     console.log(num + ' starting process...');

//     setTimeout(function(){

//     console.log(num + ' process complete...');
//     next();

//     }, Math.random()*1000 + 1000);

//   }, function(){
//     console.log('All done!');
//   });

// }());


// (function tests () {

//   var assert = require('assert');

//   var init = [{foo: 'bar'},{foo: 'baz'},{foo: 'bat'}];
//   var wasDoneCalled = false;
//   var totalCalled = 0;

//   forEach(init, function(obj, next){

//     obj.foo = 'woo';
//     totalCalled++;

//     next();

//   }, function () {
//     wasDoneCalled = true;
//     check(init);
//   });

//   var called = 0;

//   forEach(init, function(obj, next){
//     called++;
//     next();next();
//   });

//   forEach.parallel([1,2,3,4,5], function(number, next){

//     var delay = Math.floor(Math.random()*1000);

//     console.log(number + ' waits for a delay of ' + delay);

//     setTimeout(function() {
//       console.log(number);
//       next();
//     }, delay);

//   }, function(){
//     console.log('----> this is only done all the nexts are called...');
//   });

//   function check() {

//     assert.deepEqual(totalCalled, init.length);
//     assert.deepEqual(wasDoneCalled, true);

//     for (var i in init)
//       assert.deepEqual(init[i], {foo: 'woo'});
//   }

// }());

// var foo = [{foo: 'bar'},{foo: 'baz'},{foo: 'bat'}];

// forEach(foo, function(number, next){

//   console.log('Inside this! ' + number.foo);

//   return setTimeout(next, 100);

// }, function () {


//   console.log('All done!');
//   objectTest();
// });

// function objectTest () {

//   forEach({bar: 1, bam: 2, bat: 3}, function(key, value, next){

//     console.log('Key is ' + key);
//     console.log('Value is ' + value);

//     return setTimeout(next, 100);

//   }, function () {

//     console.log('Object test of this done!');
//   });
// }


module.exports = forEach;