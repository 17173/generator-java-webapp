define(function (require, exports, module) {

/**
 * 上传
 *
 * @module BaseCore
 */

'use strict';

var $ = require('$'),
    Widget = require('widget');

var Setting = require('common/magickimg/setting'),
    Process = require('common/magickimg/process');

var BaseCore = require('../base/core'),
    BaseButton = require('../base/button');

var Thumb = require('./thumb');

/**
 * Core
 *
 * @class Core
 * @constructor
 */
var Core = BaseCore.extend({

  defaults: {
    fileName: 'imageFile',
    // 魔图设置
    process: true,
    classPrefix: 'image-upload',
    url: 'imageUpload',
    queueOptions: { },
    selectOptions: {
      accept: 'image/*',
      label: '添加图片',
      // 1M
      maxSize: 5 * 1024 * 1024
    },
    buttonOptions: { }
  },

  setup: function () {
    this.on({
      render: function (e) {
        if (e.target.type === 'File') {
          initThumb(e.target);
        }
        if (e.target.type === 'Core') {
          if (this.option('process')) {
            this.initSetting(e.target);
          }
        }
      }
    });

    Core.superclass.setup.apply(this);
  },

  initSetting: function  (upload) {
    var self = this,
        batch, setting,
        activeTarget, batchEnabled, batchSettings;

    function saveSetting (e, settings) {
      if (batchEnabled) {
        batchSettings = settings;
      } else if (activeTarget) {
        Widget.get(activeTarget).data('settings', settings);
      }
    }

    function getActiveSettings () {
      return batchEnabled ? batchSettings :
          activeTarget ?
            (Widget.get(activeTarget).data('settings') || {}) : {};
    }

    function showSetting () {
      setting.$().addClass('active');
      setting.set(getActiveSettings());
      setting.change();
    }

    function hideSetting () {
      setting.$().removeClass('active');
    }

    function toggleFileSetting (e) {
      if (batchEnabled) {
        return;
      }

      if (activeTarget === e.currentTarget) {
        if (setting.is('hidden')) {
          showSetting();
          activeTarget.scrollIntoView(false);
        } else {
          hideSetting();
          $(activeTarget).removeClass('active');
          activeTarget = null;
        }
      } else {
        activeTarget && $(activeTarget).removeClass('active');
        activeTarget = e.currentTarget;
        showSetting();
        $(activeTarget).addClass('active');
        activeTarget.scrollIntoView(false);
      }
    }

    function toggleBatchSetting (actived) {
      batchEnabled = actived;
      setting.$().toggleClass('active', actived);

      activeTarget && $(activeTarget).removeClass('active');
      activeTarget = null;
    }

    // 重写 complete 方法
    self.complete = function (queueFile) {

      if (batchEnabled) {
        queueFile.data('settings', batchSettings, true);
      }

      // 魔图
      new Process({
        imageUrl: queueFile.data('remotePath'),
        settings: queueFile.data('settings'),
        events: {
          complete: function (e, thumbUrl) {
            queueFile.data('thumbUrl', thumbUrl);
            self.fire('complete', queueFile);
          }
        }
      });

      // Core.superclass.complete.apply(this, arguments);
    };

    // from File
    self.on('formData', function (e) {
      var queueFile = e.target,
          formData = queueFile.formData,
          settings = batchEnabled ? batchSettings : queueFile.data('settings');

      if (settings) {
        if (settings.tags) {
          formData.append('tags', settings.tags);
        }
        if (settings.remark) {
          formData.append('remark', settings.remark);
        }
      }
    });

    upload.queue.on({
      queue: function () {
        batch.enable(true);
      },
      empty: function () {
        batch.enable(false);
        hideSetting();
      }
    });

    batch = new BaseButton({
      container: upload.select.element,
      data: {
        icon: 'square-o',
        label: '批量处理'
      },
      delegates: {
        'click': function () {
          var self = this;

          if (self.is(':disabled')) {
            return;
          }

          if ((self.actived = !self.actived)) {
            self.$('span').attr('class', 'fa fa-check-square-o');
          } else {
            self.$('span').attr('class', 'fa fa-square-o');
          }

          toggleBatchSetting(self.actived);
        }
      },
      insert: function () {
        this.container.after(this.element);
      }
    });

    setting = new Setting({
      container: upload.queue.element,
      insert: function () {
        this.container.before(this.element);
      },
      events: {
        change: saveSetting,
        render: function (e, actived) {
          upload.queue.initDelegates({
            'click .file': toggleFileSetting
          });
        }
      }
    });
  }

});

function initThumb (file) {
  var reader = new FileReader();

  reader.onload = function (e) {
    var image = new Image();

    image.onload = function () {
      // 尺寸信息
      file.role('width').text(this.width);
      file.role('height').text(this.height);
      file.role('dimens').show();

      // 预览图
      file.thumb = new Thumb({
        container: file.element,
        image: image
      });
    };

    image.src = e.target.result;
  };

  reader.readAsDataURL(file.option('file'));
}

module.exports = Core;

});
