  /**
   * 标签输入管理
   *
   * @module Tags
   */

  'use strict';

  var $ = require('jquery'),
    Widget = require('pandora-widget');

  var KEYMAP = require('../keymap');

  var Input = require('./input');

  /**
   * Tags
   *
   * @class Tags
   * @constructor
   */
  var Tags = Widget.extend({

    type: 'Tags',

    defaults: {
      // 样式前缀
      classPrefix: 'ue-tags',
      // 事件代理
      delegates: {
        'mousedown [data-role=tag]': 'mousedown',
        'keydown [data-role=tag]': 'keydown'
      },
      // 输入框，必须提供
      field: '',
      insert: function() {
        this.field.after(this.element);
      },
      maxlength: 200,
      tagMaxlength: 50,
      // 分隔符
      delimiter: /[,，;；]/,
      template: require('./tags.handlebars')
      /*suggest: {
        url: 'tagsList',
        key: 'tag'
      }*/
    },

    setup: function() {
      var self = this;

      self.element.attr('title', '确认输入请按 Enter 键');
      self.initField();
      self.render();
      self.initInput();
    },

    initField: function() {
      var self = this;

      self.field = $(self.option('field'));
      self.initValue = self.field.val();

      if (self.field.length === 0) {
        throw new Error('field is required');
      }

      var maxlength = self.field.attr('maxlength');

      if (maxlength) {
        self.option('maxlength', +maxlength);
      }

      self.field.on('change', function() {
        self.data('tags', self.getTags(), true);
        self.data('tags2', self.getTags2(), true);
        self.fire('change');
        self.render();
      }).hide();

      self.data('tags', self.getTags());
    },

    initInput: function() {
      var self = this,
        input;

      input = new Input({
        container: self.role('tags'),
        delimiter: self.option('delimiter'),
        events: {
          cache: function(e) {
            // 事件传递
            self.fire.apply(self, arguments);
          },
          // 递交
          deliver: function(e, tags) {
            self.create(tags);
          },
          // 退格
          backward: function(e) {
            self.remove();
          },
          change : function(e, value){
            var label = self.role('label');
            var dataTags = self.data('tags');
            if(value === '' && dataTags.length === 0){
              label.show();
            }else{
              label.hide();
            }
          }
        },
        maxlength: self.option('tagMaxlength'),
        suggest: self.option('suggest')
      });

      self.initDelegates({
        'mousedown': function(e) {
          if (e.target.getAttribute('data-role') !== 'tag') {
            self.$('.active').removeClass('active');
            input.focus();
          }
        }
      });

      // 输入框在 render 前移走，render 后移入
      self.on({
        change: function() {
          input.element.appendTo('body');
          input.focus();
        },
        render: function() {
          input.element.appendTo(self.role('tags'));
        },
        destroy: function() {
          input.destroy();
        }
      });
    },

    mousedown: function(e) {
      // e.stopPropagation();

      $(e.currentTarget).addClass('active')
        .siblings('.active')
        .removeClass('active');

      this.fire('select', e.currentTarget.textContent);
    },

    keydown: function(e) {
      e.preventDefault();

      switch (e.keyCode) {

        case KEYMAP.DELETE:
        case KEYMAP.BACKSPACE:
          this.remove($(e.currentTarget).text());
          break;
      }
    },

    create: function(tags) {
      var dataTags = this.data('tags') || [];

      tags.forEach(function(tag) {
        tag = tag.trim();
        if (tag && dataTags.indexOf(tag) === -1) {
          dataTags.push(tag);
        }
      });

      this.value(dataTags);

      this.fire('change');

      this.render();
    },

    remove: function(tag) {
      var dataTags;

      tag || (tag = this.role('tag').eq(-1).text());

      if (!tag) {
        return;
      }

      dataTags = this.data('tags');

      if (tag) {
        dataTags.forEach(function(dataTag, i) {
          if (dataTag === tag) {
            dataTags.splice(i, 1);
          }
        });
      } else {
        tag = dataTags.pop();
      }

      this.value(dataTags);

      this.fire('change');
      this.fire('remove', tag);

      if (dataTags.length === 0) {
        this.fire('empty');
      }

      this.render();
    },

    value: function(value) {
      var field = this.field,
        maxlength;

      if (typeof value === 'undefined') {
        return field.val();
      }

      if (Array.isArray(value)) {
        value = value.join(',');
      }

      maxlength = this.option('maxlength');

      // TODO 有时 value 为 id 值，判断就不准
      if (value.length > maxlength) {
        value = value.substring(0, maxlength);

        if (this.option('delimiter').test(value.charAt(maxlength - 1))) {
          value = value.substring(0, maxlength - 1);
        }

        field.val(value);
        field.trigger('change');
      } else {
        field.val(value);
        // 创建时，要重新 render 了一次
        !this.initValue && field.trigger('change');
      }



    },

    getTags: function() {
      if (!this.value()) {
        return '';
      }
      var tags = this.value().trim()
        .split(this.option('delimiter')),
        pureTags = [];

      tags.forEach(function(tag) {
        if (tag.trim() !== '') {
          pureTags.push(tag);
        }
      });

      return pureTags;
    },

    getTags2: function() {
      var tags = this.getTags();

      if (tags) {
        return tags.map(function(tag) {
          return {
            text: tag
          };
        }, true);
      } else {
        return [];
      }
    },

    render: function() {
      this.data('placeholder',this.option('placeholder'));

      // hacks for chrome 36
      this.data('tags') && this.data('tags2', this.data('tags').map(function(tag) {
        return {
          text: tag
        };
      }), true);

      Tags.superclass.render.apply(this);

      if(this.data('tags').length){
        this.role('label').hide();
      }
    }

  });

  module.exports = Tags;

