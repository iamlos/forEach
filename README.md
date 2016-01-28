### forEach

There are so many libraries that do this sort of thing – this is just my preferred syntax. If pass an error to next, everything stops and the final callback is invoked with whatever error you passed.

I like it because it's easy to switch between series and parallel. It also supports iteration of lists and objects.

**Series**

```javascript
forEach([1,2,3], function(number, next){

  // Do something, async or not
  next(err);

}, function(err){
  // Everything finished
});
```

**Parallel**

```javascript

var each = forEach.parallel;

each([1,2,3], function(number, next){

  // Do something, async or not
  next(err);

}, function(err){
  // Everything done
});
```

**Parallel with cap**

This is useful for running a reasonable number of network requests in parallel.

```javascript

var each = forEach.parallel(10);

each([1,2,3], function(number, next){

  // Do something, async or not
  next(err);

}, function(err){
  // Everything done
});
```