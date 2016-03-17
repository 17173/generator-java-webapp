  /**
   * 标签输入管理
   *
   * @module Tags
   */

  'use strict';

  var $ = require('jquery'),
    Overlay = require('pandora-overlay'),
    Locker = require('pandora-locker');

  var io = require('../io'),
    KEYMAP = require('../keymap');

  /**
   * Suggest
   *
   * @class Suggest
   * @constructor
   */
  var Suggest = Overlay.extend({

    type: 'Suggest',

    defaults: {
      baseXY: {
        x: 0,
        y: 1
      },
      classPrefix: 'ue-suggest',
      css: {
        zIndex: 902
      },
      data: {
        nomatch: '未找到匹配'
      },
      delegates: {
        'click [data-role=tag]': function(e) {
          this.navigate($(e.currentTarget));
          this.fire('select');
        }
      },
      effect: 'none',
      events: {
        show: function() {
          this.navigate();
        }
      },
      interval: 200,
      // 是否只允许从联想输入
      // strict: false,
      template: require('./suggest.handlebars')
    },

    setup: function() {
      this.locker = new Locker();
    },

    suggest: function(value) {
      var self = this;

      if (self.timeout) {
        window.clearTimeout(self.timeout);
      }

      if (!value) {
        self.deactive();
        return;
      }

      self.activeIndex = -1;

      self.timeout = window.setTimeout(function() {
        // 检查缓存
        var cache = self.locker.get(value),
          data;

        if (cache) {
          self.present(cache);
        } else {
          data = self.option('parameter') || {};

          data[self.option('key')] = value;

          io.get(self.option('url'), data, function() {
            var tags = this.data.listData || this.data;
            // 设置缓存
            self.locker.set(value, tags);
            // 通知缓存数据
            self.fire('cache', tags);
            self.present(tags);
          });
        }
      }, self.option('interval'));
    },

    present: function(tags) {
      this.stop();

      if (tags.length) {
        this.convert(tags);
        // 渲染
        this.render();
      } else {
        // 严格模式下，提示未找到匹配
        if (this.option('strict')) {
          this.data('tags', null);
          // 渲染
          this.render();
        } else {
          this.hide();
        }
      }
    },

    convert: function(tags) {
      var map = this.option('map');

      if (map) {
        tags = tags.map(function(tag) {
          return tag[map];
        });
      }

      this.data('tags', tags, true);
    },

    keydown: function(e) {
      switch (e.keyCode) {

        case KEYMAP.UP:
          this.navigate(-1);
          e.preventDefault();
          break;

        case KEYMAP.DOWN:
          this.navigate(1);
          e.preventDefault();
          break;

        case KEYMAP.ENTER:
          if (this.activeIndex !== -1) {
            this.fire('select');
            e.preventDefault();
          } else {
            if (this.option('strict')) {
              e.preventDefault();
            }
          }
          break;
      }
    },

    navigate: function(offset) {
      var self = this,
        tags = self.role('tag'),
        count = tags.length,
        activeTag, activeIndex = -1;

      if (count) {

        if (typeof offset === 'number') {
          activeIndex = self.activeIndex + offset;

          if (activeIndex < 0) {
            activeIndex = count - 1;
          }

          if (activeIndex === count) {
            activeIndex = 0;
          }

        } else if (offset) {
          activeIndex = offset.index();
        } else {
          activeIndex = 0;
        }

        activeTag = tags.eq(activeIndex);

        activeTag.addClass('selected')
          .siblings('.selected')
          .removeClass('selected');

        activeTag.get(0).scrollIntoViewIfNeeded(false);
      }

      self.activeIndex = activeIndex;
    },

    deactive: function() {
      this.activeIndex = -1;
      this.hide();
    },

    getActiveTag: function() {
      if (this.activeIndex === -1) {
        return '';
      }

      return this.role('tag').eq(this.activeIndex).text();
    }

  });

  module.exports = Suggest;

