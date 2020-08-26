/* */ 
'use strict';
const constants = exports;
constants._reverse = function reverse(map) {
  const res = {};
  Object.keys(map).forEach(function(key) {
    if ((key | 0) == key)
      key = key | 0;
    const value = map[key];
    res[value] = key;
  });
  return res;
};
constants.der = require('./der');
