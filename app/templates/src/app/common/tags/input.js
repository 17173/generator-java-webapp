/**
 * 标签输入管理
 *
 * @module Tags
 */

'use strict';

var $ = require('jquery'),
    Widget = require('pandora-widget');

var util = require('../util'),
    KEYMAP = require('../keymap');

var Suggest = require('./suggest');

/**
 * Input
 *
 * @class Input
 * @constructor
 */
var Input = Widget.extend({

  type: 'Input',

  defaults: {
    classPrefix: 'input',
    container: null,
    element: '<input type="text" data-role="input"/>',
    delegates: {
      'input': 'input',
      'cut': 'input',
      'paste': 'input'
    },
    maxlength: 50
  },

  setup: function () {
    this.element.attr('maxlength', this.option('maxlength'));

    this.render();

    this.initSuggest();

    this.initDelegates({
      'keydown': 'keydown'
    });
  },

  initSuggest: function () {
    var self = this,
      optionSuggest = self.option('suggest');

    if (!optionSuggest) {
      return;
    }

    var suggest = new Suggest($.extend(true, {
      baseElement: self.element,
      events: {
        cache: function (e) {
          // 事件传递
          self.fire.apply(self, arguments);
        },
        select: function () {
          self.value(this.getActiveTag());
          self.deliver();
        }
      }
    }, optionSuggest));

    self.initDelegates({
      'keydown': function (e) {
        suggest.keydown(e);
      },
      'focus': function (e) {
        if (suggest.activeIndex !== -1) {
          suggest.show();
        }
      }
    });

    self.initDelegates({
      'mousedown': function (e) {
        if (!(suggest.is(e.target) ||
              self.is(e.target) ||
              suggest.$(e.target).length ||
              self.$(e.target).length)) {
          suggest.hide();
        }
      }
    }, self.document);

    self.on({
      backward: function () {
        suggest.deactive();
      },
      deliver: function () {
        suggest.deactive();
      },
      change: function () {
        suggest.suggest(self.value());
      }
    });
  },

  focus: function () {
    var self = this;

    setTimeout(function () {
      self.element.focus();
    }, 0);
  },

  keydown: function (e) {
    switch (e.keyCode) {

      case KEYMAP.ENTER:
        if (!e.isDefaultPrevented()) {
          if (/\S/.test(this.value())) {
            this.deliver();
            e.preventDefault();
          }
        }
        break;

      case KEYMAP.BACKSPACE:
        if (!/\S/.test(this.value())) {
          this.backward();
          e.preventDefault();
        }
        break;
    }
  },

  input: function (e) {
    var val = this.value();

    if (val === '' || !this.option('delimiter').test(val)) {
      this.onchange(val);
      return;
    }

    this.deliver();
  },

  deliver: function () {
    this.fire('deliver', this.getTags());

    this.value('');
    this.onchange();
  },

  onchange: function () {
    var value = this.value();

    this.element.css({
      width: getStringWidth(this.element, value)
    });

    this.fire('change', value);
  },

  backward: function () {
    this.fire('backward');
  },

  value: function (value) {
    if (typeof value === 'undefined') {
      return this.element.val();
    }

    this.element.val(value);
  },

  getTags: function () {
    var tags = this.value().trim().split(this.option('delimiter'));

    tags.forEach(function (tag, i) {
      if (tag.trim() === '') {
        tags.splice(i, 1);
      }
    });

    return tags;
  }

});

function getStringWidth (sibling, value) {
  var dummy = $('<div/>')
        .css({
          position: 'absolute',
          left: -9999,
          top: -9999,
          width: 'auto',
          whiteSpace: 'nowrap'
        })
        .html(util.escape(value).replace(/ /g, '&nbsp;'))
        .insertAfter(sibling),

    width = dummy.width();

  dummy.remove();

  return width + 2;
}

module.exports = Input;

