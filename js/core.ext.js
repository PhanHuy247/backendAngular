window.isSet = function(test) {
  return typeof test !== 'undefined' && test !== null;
};
window.isUnset = function(test) {
  return typeof test === 'undefined' || test === null;
};
window.isFunction = function(test) {
  return typeof test === 'function';
};
window.isString = function(test) {
  return isSet(test) && (typeof test === 'string' || test instanceof String);
};
window.isArray = function(test) {
  return isSet(test) && test instanceof Array;
};
window.parseIntNullable = function(value) {
  return isUnset(value) || isNaN(parseInt(value, 10)) ? null : parseInt(value, 10);
};
window.parseFloatNullable = function(value) {
  return isUnset(value) || isNaN(parseFloat(value)) ? null : parseFloat(value);
};
Array.prototype.compare = function(array) {
  // if the other array is a falsy value, return
  if (!array)
    return false;

  // compare lengths - can save a lot of time
  if (this.length != array.length)
    return false;

  for (var i = 0; i < this.length; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].compare(array[i]))
        return false;
    } else if (this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
};
Array.prototype.sortByKey = function(key) {
  this.sort(function(a, b) {
    var keyA = a[key], keyB = b[key]
    // Compare the 2 dates
    if (keyA < keyB)
      return -1;
    if (keyA > keyB)
      return 1;
    return 0;
  });
};