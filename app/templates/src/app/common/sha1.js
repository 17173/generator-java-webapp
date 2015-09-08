define(function(require, exports, module) {

'use strict';

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS 180-1
 * Version 2.2 Copyright Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

module.exports = (function() {

  var fromCharCode = String.fromCharCode;
  /*
   * Calculate the SHA1 of a raw string
   */
  function rstrSha1(s) {
    return binb2rstr(binbSha1(rstr2binb(s), s.length * 8));
  }

  /*
   * Convert a raw string to a hex string
   */
  function rstr2hex(input) {
    var output = '';
    var x;
    for (var i in input) {
      x = input.charCodeAt(i);
      output += ((x >> 4) & 0x0F).toString(16) + (x & 0x0F).toString(16);
    }
    return output;
  }

  /*
   * Encode a string as utf-8.
   * For efficiency, this assumes the input is valid utf-16.
   */
  function str2rstrUtf8(input) {
    var output = '';
    var i = -1;
    var x, y;

    while (++i < input.length) {
      /* Decode utf-16 surrogate pairs */
      x = input.charCodeAt(i);
      y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
      if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
        x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
        i++;
      }

      /* Encode output as utf-8 */
      if (x <= 0x7F) {
        output += fromCharCode(x);
      } else if (x <= 0x7FF) {
        output += fromCharCode(0xC0 | ((x >> 6) & 0x1F),
          0x80 | (x & 0x3F));
      } else if (x <= 0xFFFF) {
        output += fromCharCode(0xE0 | ((x >> 12) & 0x0F),
          0x80 | ((x >> 6) & 0x3F),
          0x80 | (x & 0x3F));
      } else if (x <= 0x1FFFFF) {
        output += fromCharCode(0xF0 | ((x >> 18) & 0x07),
          0x80 | ((x >> 12) & 0x3F),
          0x80 | ((x >> 6) & 0x3F),
          0x80 | (x & 0x3F));
      }
    }
    return output;
  }

  /*
   * Convert a raw string to an array of big-endian words
   * Characters >255 have their high-byte silently ignored.
   */
  function rstr2binb(input) {
    var output = [];
    for (var i = 0; i < input.length * 8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
    }
    return output;
  }

  /*
   * Convert an array of big-endian words to a string
   */
  function binb2rstr(input) {
    var output = '';
    for (var i = 0; i < input.length * 32; i += 8) {
      output += fromCharCode((input[i >> 5] >> (24 - i % 32)) & 0xFF);
    }
    return output;
  }

  /*
   * Calculate the SHA-1 of an array of big-endian words, and a bit length
   */
  function binbSha1(x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << (24 - len % 32);
    x[((len + 64 >> 9) << 4) + 15] = len;

    var w = [];
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    var e = -1009589776;

    for (var i = 0; i < x.length; i += 16) {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;
      var olde = e;

      for (var j = 0; j < 80; j++) {
        if (j < 16) {
          w[j] = x[i + j];
        } else {
          w[j] = bitRol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
        }
        var t = safeAdd(safeAdd(bitRol(a, 5), sha1Ft(j, [b, c, d])),
          safeAdd(safeAdd(e, w[j]), sha1Kt(j)));
        e = d;
        d = c;
        c = bitRol(b, 30);
        b = a;
        a = t;
      }

      a = safeAdd(a, olda);
      b = safeAdd(b, oldb);
      c = safeAdd(c, oldc);
      d = safeAdd(d, oldd);
      e = safeAdd(e, olde);
    }
    return [a, b, c, d, e];

  }

  /*
   * Perform the appropriate triplet combination function for the current
   * iteration
   */
  function sha1Ft(t, a) {
    if (t < 20) {
      return (a.b & a.c) | ((~a.b) & a.d);
    }
    if (t < 40) {
      return a.b ^ a.c ^ a.d;
    }
    if (t < 60) {
      return (a.b & a.c) | (a.b & a.d) | (a.c & a.d);
    }
    return a.b ^ a.c ^ a.d;
  }

  /*
   * Determine the appropriate additive constant for the current iteration
   */
  function sha1Kt(t) {
    return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
      (t < 60) ? -1894007588 : -899497514;
  }

  /*
   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
   * to work around bugs in some JS interpreters.
   */
  function safeAdd(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  /*
   * Bitwise rotate a 32-bit number to the left.
   */
  function bitRol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  return function(s) {
    return rstr2hex(rstrSha1(str2rstrUtf8(s)));
  };

})();

});