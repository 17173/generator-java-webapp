  'use strict';

  var Dialog = require('pandora-dialog');

  var StepCanvas = Dialog.extend({

    defaults: {
      data: {
        cancel: '<span data-role="prev" class="btn btn-default">返回上一步</span>',
        submit: '<span data-role="next" class="btn btn-primary">下一步</span>'
      },
      mask: true,
      maskFixed: true,
      //不可为空
      step: [],
      delegates: {
        'click [data-role=submit]': 'submit',
        'click [data-role=cancel]': 'cancel'
      }
    },

    setup: function() {
      var self = this,
        stepSize = self.option('step').length,
        content = [];

      while (stepSize--) {
        content.push('<div style="display:none"></div>');
      }

      self.option('content', content.join(''));

      StepCanvas.superclass.setup.apply(self);

      self.select(0);
    },

    select: function(index) {
      var self = this,
        steps, stepSize,
        current, children, element;

      if (index < 0) {
        self.close();
        return;
      }

      steps = self.option('step');
      stepSize = steps.length;

      if (index >= stepSize) {
        self.fire('done');
        return;
      }

      children = self.role('content').children();

      if (typeof self.currentIndex !== 'undefined') {
        current = steps[self.currentIndex];
        children.eq(self.currentIndex).hide();
      }

      current = steps[index];

      self.role('prev').text(current.prevLabel ||
        ((index > 0) ? '返回上一步' : '取消'));
      self.role('next').text(current.nextLabel ||
        ((index === stepSize - 1) ? '确定' : '下一步'));

      element = children.eq(index).show();

      self.currentIndex = index;

      current.enter.apply(self, [element]);
    },

    submit: function() {
      var current;

      if (typeof this.currentIndex !== 'undefined') {
        current = this.option('step')[this.currentIndex];
        current.leave.apply(this, [this.role('content').children(':eq(' + this.currentIndex + ')')]);
      }
    },

    cancel: function() {
      this.select(this.currentIndex - 1);
    },

    next: function() {
      this.select(this.currentIndex + 1);
    }

  });

  module.exports = StepCanvas;

