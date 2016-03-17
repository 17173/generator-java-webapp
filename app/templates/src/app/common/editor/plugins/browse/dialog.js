  'use strict';

  var ImageDialog = require('../../../image/dialog'),
    Button = require('../../../button/button');

  /**
   * 弹窗图片库
   *
   * @class  Dialog
   * @constructor
   * @extends ImageDialog
   */
  var Dialog = ImageDialog.extend({

    initUploadCloseButton: function(pane) {
      var self = this;

      self.button = new Button({
        container: pane,
        data: {
          icon: 'chevron-down',
          label: '确定插入'
        },
        delegates: {
          'click': function() {
            self.fire('confirmAppend', self.upload.queue.getCompleteFiles());
          }
        }
      });

      self.upload.on({
        complete: function() {
          self.button.enable(true);
        },
        empty: function() {
          self.button.enable(false);
        }
      });
    }

  });

  module.exports = Dialog;

