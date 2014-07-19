define(function (require, exports, module) {

/**
 * 表单提交
 *
 * @module Form
 */

'use strict';

var Widget = require('widget');

/**
 * Core
 *
 * @class Core
 * @constructor
 */
module.exports = Widget.extend({

  defaults: {
    classPrefix: 'ue-form',
    data: {
      groups: [
        // {
        //   label: '组件源名称',
        //   attrs: {
        //     type: 'text',
        //     name: 'compSourceName',
        //     required: 'required'
        //   }
        // },
        // {
        //   label: '注释',
        //   value: 'blah blah blah',
        //   attrs: {
        //     type: 'multiline',
        //     name: 'compSourceDesc',
        //     required: 'required'
        //   }
        // },
        // {
        //   // colspan: '12',
        //   flex: true,
        //   attrs: {
        //     'data-role': 'combine'
        //   },
        //   groups: [
        //     {
        //       label: '标题',
        //       attrs: {
        //         type: 'text',
        //         name: 'title',
        //         required: 'required'
        //       }
        //     },
        //     {
        //       label: '网址',
        //       attrs: {
        //         type: 'text',
        //         name: 'url',
        //         required: 'required'
        //       }
        //     }
        //   ]
        // },
        // {
        //   label: '占位符',
        //   attrs: {
        //     id: 'some-palceholder'
        //   },
        //   groups: [
        //     {
        //       attrs: {
        //         type: 'button',
        //         'data-role': 'combile-add'
        //       },
        //       value: '添加'
        //     },
        //     {
        //       attrs: {
        //         type: 'button',
        //         'data-role': 'combile-del'
        //       },
        //       value: '删除'
        //     }
        //   ]
        // },
        // {
        //   label: '占位符2',
        //   attrs: {
        //     id: 'some-palceholder2'
        //   },
        //   value: '占位符2'
        // },
        // {
        //   // colspan: '12',
        //   // flex: true,
        //   label: '怎么样？',
        //   groups: [
        //     {
        //       label: 'Y',
        //       attrs: {
        //         type: 'radio',
        //         name: 'radio',
        //         required: 'required'
        //       }
        //     },
        //     {
        //       label: 'N',
        //       attrs: {
        //         type: 'radio',
        //         name: 'radio',
        //         required: 'required'
        //       }
        //     }
        //   ]
        // },
        // {
        //   label: '尺寸',
        //   flex: true,
        //   groups: [
        //     {
        //       // label: '宽',
        //       colspan: '6',
        //       attrs: {
        //         type: 'number',
        //         name: 'width',
        //         // value: formData.width,
        //         max: 9999,
        //         // placeholder: '',
        //         required: 'required'
        //       }
        //     },
        //     {
        //       label: '&times;',
        //       colspan: '0'
        //     },
        //     {
        //       // label: '高',
        //       colspan: '6',
        //       attrs: {
        //         type: 'number',
        //         name: 'height',
        //         // value: formData.height,
        //         max: 9999,
        //         // placeholder: '',
        //         required: 'required'
        //       }
        //     }
        //   ]
        // }
      ]
    },
    template: require('./form.handlebars'),
    templateOptions: {
      helpers: {
        // ifequal: function(v1, v2, options) {
        //   return (v1 == v2) ? options.fn(this) : options.inverse(this);
        // },
        isInTypes: function(type, types, options) {
          return (types.split(',').indexOf(type) !== -1) ? options.fn(this) : options.inverse(this);
        },
        getColSpan: function(span, options) {
          if (span === null) {
            return '';
          }
          (typeof span === 'undefined') && (span = 3);
          return 'col-sm-' + (span--) + ' col-md-' + (span--);
        },
        getColSpanRest: function(span, options) {
          if (span === null) {
            return '';
          }
          (typeof span === 'undefined') && (span = 3);
          span = 12 - span;
          return 'col-sm-' + (span++) + ' col-md-' + (span++);
        },
        getColSpanOffset: function(span, options) {
          if (span === null) {
            return '';
          }
          (typeof span === 'undefined') && (span = 3);
          return 'col-sm-offset-' + (span) + ' col-sm-' + (12 - span--) +
            ' col-md-offset-' + (span) + ' col-md-' + (12 - span--);
        },
        showCol: function(span, options) {
          return span === null  ? options.inverse(this) : options.fn(this);
        }
      },
      partials: {
        groups: require('./form-groups.handlebars'),
        types: require('./form-types.handlebars'),
        notype: require('./form-notype.handlebars'),
        element: require('./form-element.handlebars'),
        attrs: require('./form-attrs.handlebars'),
        buttons: require('./form-buttons.handlebars')
      }
    }
  },

  setup: function () {
    this.render();
  }

});

});
