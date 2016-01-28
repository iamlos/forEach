### forEach

There are so many libraries that do this sort of thing – this is my preferred syntax.

**Series**

```javascript
forEach([1,2,3], function(number, next){

  // Do something, async or not
  next();

}, function(err){
  // Everything finished
});
```

**Parallel**

```javascript

var each = forEach.parallel;

each([1,2,3], function(number, next){

  // Do something, async or not
  next();

}, function(err){
  // Everything done
});
```

**Parallel with cap**

*This is useful for running a reasonable number of network requests in parallel.*

```javascript

var each = forEach.parallel(10);

each([1,2,3], function(number, next){

  // Do something, async or not
  next();

}, function(err){
  // Everything done
});
```