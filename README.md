# forEach

```javascript
var list = [1,2,3];

// This runs in series
forEach(list, function(number, next){

  // Do something, async or not
  next();

}, function(err) {
  // Everything finished
});

// This runs in parallel
forEach.parallel(list, function(number, next){

  // Do something, async or not
  next();

}, function(err) {
  // Everything finished
});

// This runs with parallel, with a cap

forEach.parallel(10)(list, function(number, next){

  // Do something, async or not
  next();

}, function(err) {
  // Everything finished
});
```
