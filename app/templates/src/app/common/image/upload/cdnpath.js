'use strict';

function hashCode (str) {
  // based on JDK1.5 String.hashCode()
  var h = 0, i, n;

  for (i = 0, n = str.length; i < n; i++) {
    h = h * 31 + str.charCodeAt(i);
    h = h & h; // convert to 32bit integer
  }

  return h;
}

function getIndex (path) {
  return (((hashCode(path) & 0x7fffffff) % 3) + 1);
}

module.exports = function (path) {
  return '//i' + getIndex(path) + '.17173cdn.com' + path;
};

