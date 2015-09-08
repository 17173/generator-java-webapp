define(function(require, exports, module) {

  /**
   * 表单提交
   *
   * @module Form
   */

  'use strict';

  var Widget = require('widget');

  var isChrome36 = navigator.userAgent.indexOf('Chrome/36.') > 0;

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
        layout: 'horizontal',
        groups: []
      },
      // 表单项值
      // values: {},
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
            return 'col-sm-' + (span--) + ' col-md-' + (span--) + ' col-lg-' + (span);
          },
          getColSpanRest: function(span, expand, options) {
            if (span === null) {
              return '';
            }
            (typeof span === 'undefined') && (span = 3);
            span = 12 - span + (expand || 0);
            return 'col-sm-' + (span++) + ' col-md-' + (span++) + ' col-lg-' + (span);
          },
          getColSpanOffset: function(span, options) {
            if (span === null) {
              return '';
            }
            (typeof span === 'undefined') && (span = 3);
            return 'col-sm-offset-' + (span) + ' col-sm-' + (12 - span--) +
              ' col-md-offset-' + (span) + ' col-md-' + (12 - span--) +
              ' col-lg-offset-' + (span) + ' col-lg-' + (12 - span);
          },
          showCol: function(span, options) {
            return span === null ? options.inverse(this) : options.fn(this);
          }
        },
        partials: {
          groups: require('./form-groups.handlebars'),
          types: require('./form-types.handlebars'),
          notype: require('./form-notype.handlebars'),
          element: require('./form-element.handlebars'),
          attrs: isChrome36 ? require('./form-attrs2.handlebars') : require('./form-attrs.handlebars'),
          buttons: require('./form-buttons.handlebars')
        }
      }
    },

    setup: function() {
      this.initValues();
      if (isChrome36) {
        this.transForChrome36();
      }
      this.render();
    },

    initValues: function() {
      var self = this,
        groups,
        values = this.option('values');

      // 遍历 select/options
      function walkOptions(options, value) {
        options.forEach(function(option) {
          option.selected = (value === option.value);
        });
      }

      // 遍历 data/groups
      function walkGroups(groups) {
        groups.forEach(function(item) {
          var attrs,
            options,
            key;

          if (item.groups) {
            walkGroups(item.groups);
            return true;
          }

          attrs = item.attrs;

          if (!attrs || !attrs.name) {
            return true;
          }

          options = item.options;

          for (key in values) {

            if (attrs.name === key) {

              if (options) {
                walkOptions(options, values[key]);
                break;
              }

              if (/^(checkbox|radio)$/.test(attrs.type)) {
                attrs.checked = (values[key] === attrs.value);
                break;
              }

              attrs.value = values[key];
              break;
            }
          }
        });
      }

      if (!values) {
        return;
      }

      groups = self.data('groups');

      if (!groups || !groups.length) {
        return;
      }

      walkGroups(groups);
    },

    /**
     * 获取 name 对应的元素，通过 [name=xxx]
     * 支持逗号分隔的 names 值
     *
     * @method name
     * @param {string} name 以逗号分隔的 name 的值
     * @return {jquery} DOM 节点
     */
    name: function(name) {
      return this.$(name.replace(/(?:^\b|\s*,\s*)([_0-9a-zA-Z\-]+)/g, ',[name="$1"]').substring(1));
    },

    getValueOf: function(name) {
      var elem = this.name(name),
        value;

      if (elem.is(':checkbox, :radio')) {
        value = [];

        elem.each(function(i, item) {
          if (item.checked) {
            value.push(item.value);
          }
        });

        if (value.length === 0) {
          return;
        }

        return value.join(',');
      }

      return elem.val();
    },

    setValueOf: function(name, value) {
      var elem = this.name(name);

      if (elem.is(':checkbox, :radio')) {
        value = value.split(',');

        elem.each(function(i, item) {
          item.checked = (value.indexOf(item.value) !== -1);
        });
      }

      elem.val(value);

      return this;
    },

    // 为了兼容 CHROME 36
    trans: function() {
      function tranAttrs(attrs) {
        var arr = [],
          key;
        for (key in attrs) {
          arr.push({
            name: key,
            value: attrs[key]
          });
        }
        return arr;
      }

      function transGroups(groups) {
        if (!groups) {
          return;
        }

        groups.forEach(function(group) {
          if (group.attrs) {
            group.attrs2 = tranAttrs(group.attrs);
          }

          transGroups(group.groups);
        });
      }

      transGroups(this.data('groups'));
      transGroups(this.data('buttons'));
    }

  });

});
