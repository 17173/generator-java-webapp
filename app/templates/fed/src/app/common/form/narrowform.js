define(function (require, exports, module) {

/**
 * 表单提交
 *
 * @module Form
 */

'use strict';

var Form = require('./form');

/**
 * NarrowForm
 *
 * @class NarrowForm
 * @constructor
 * @extends {Class} Confirm
 */
var NarrowForm = Form.extend({

  defaults: {
    data: {
      autocomplete: 'off',
      buttons: null
    },
    templateOptions: {
      helpers: {
        getColSpan: function(span, options) {
          if (span === null) {
            return '';
          }
          (typeof span === 'undefined') && (span = 2);
          return 'col-md-' + span + ' col-sm-' + span;
        },
        getColSpanRest: function(span, options) {
          if (span === null) {
            return '';
          }
          (typeof span === 'undefined') && (span = 2);
          span = 12 - span;
          return 'col-md-' + span + ' col-sm-' + span;
        }
      }
    }
  }

});

module.exports = NarrowForm;

});
