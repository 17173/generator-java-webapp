define(function (require, exports, module) {

/**
 * 表单提交
 *
 * @module Form
 */

'use strict';

var Class = require('class');

/**
 * Data
 *
 * @class Data
 * @constructor
 */
var Data = Class.create({

  initialize: function (elements) {
    var self = this;

    self.dataArray = [];

    Array.prototype.forEach.call(elements, function (elem) {
      if (elem.type === 'radio' || elem.type === 'checkbox') {
        if (!elem.checked) {
          return true;
        }
      }
      self.append(elem.name, elem.value.trim());
    });
  },

  append: function (name, value) {
    var found;

    if (typeof value === 'string') {
      value = value.trim();
    }

    this.forEach(function (json) {
      if (json.name === name) {
        found = true;
        if (Array.isArray(json.value)) {
          json.value.push(value);
        } else {
          json.value = [json.value, value];
        }
        return false;
      }
    });

    if (!found) {
      this.dataArray.push({
        name: name,
        value: value
      });
    }
  },

  remove: function (name, value) {
    this.forEach(function (json, i, dataArray) {
      if (json.name === name) {
        if ((typeof value === 'undefined') || json.value === value) {
          dataArray.splice(i, 1);
        }
        return false;
      }
    });
  },

  get: function (name) {
    var value;

    this.forEach(function (json) {
      if (json.name === name) {
        value = json.value;
        return false;
      }
    });

    return value;
  },

  set: function (name, value) {
    if (typeof value === 'string') {
      value = value.trim();
    }

    this.forEach(function (json) {
      if (json.name === name) {
        json.value = value;
        return false;
      }
    });
  },

  forEach: function (callback) {
    this.dataArray.forEach(callback);
  },

  paramify: function () {
    var encode = window.encodeURIComponent,
        params = [];

    this.forEach(function (json) {
      var name = json.name,
          value = json.value;

      if (name) {
        if (value && value.constructor === Object) {
          value = JSON.stringify(value);
        }
        params.push(encode(name) + '=' + encode(value));
      }
    });

    return params.join('&').replace(/%20/g, '+');
  },

  toJSON: function () {
    var params = {};

    this.forEach(function (json) {
      if (!json.name) {
        return true;
      }
      params[json.name] = json.value;
    });

    return params;
  }

});

module.exports = Data;

});
