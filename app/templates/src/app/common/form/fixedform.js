define(function(require, exports, module) {

  /**
   * 表单提交
   *
   * @module Form
   */

  'use strict';

  var Form = require('./form');

  /**
   * 固定宽度（百分比）的表单
   *
   * @class FixedForm
   * @constructor
   * @extends {Class} Form
   */
  var FixedForm = Form.extend({

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
            if (typeof span === 'undefined') {
              span = 2;
            }
            return 'col-sm-' + span + ' col-md-' + span + ' col-lg-' + span;
          },
          getColSpanRest: function(span, expand, options) {
            if (span === null) {
              return '';
            }
            if (typeof span === 'undefined') {
              span = 2;
            }
            span = 12 - span + (expand || 0);
            return 'col-sm-' + span + ' col-md-' + span + ' col-lg-' + span;
          }
        }
      }
    }

  });

  module.exports = FixedForm;

});
