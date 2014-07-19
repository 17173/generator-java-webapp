define(function (require, exports, module) {

'use strict';

var $ = require('$'),
    Confirm = require('confirm'),
    Tips = require('tips'),
    Tabs = require('tabs'),
    Select = require('select');

var Setting = require('common/magickimg/setting'),
    Process = require('common/magickimg/process');

var Upload = require('common/upload/image/core'),
    Button = require('common/upload/base/button');

var Browse = require('./browse');

/**
 * 弹窗图片库
 *
 * @module common/gallery/dialog
 * @class  Dialog
 * @constructor
 * @extends Confirm
 * @return {[type]}   [description]
 */
var Dialog = Confirm.extend({

  defaults: {
    classPrefix: 'ue-dialog ue-dialog-tabs',
    content: require('./dialog.tpl'),
    css: {
      position: 'absolute',
      width: 930
    },
    events: {
      'before:destroy': function () {
        return false;
      },
      'render': function () {
        this.initTabs();
      },
      'submit': function () {
        if (this.activeTab === 1) {

        } else {
          this.processPic(this.browse.getSelectedData());
        }
        return false;
      }
    },
    // 图片列表配置
    galleryOptions: {
      buttons: null,
      key: {
        title: 'name',
        url: 'remotePath',
        id: 'fid'
      },
      thumbAffix: '!a-1-160x120.jpg',
      // element: '#J_GallerySearch',
      pageSize: 10,
      selectable: 'single',
      url: 'imageSearch'
    },
    initialTab: 0,
    title: '<ul class="nav nav-tabs" data-role="tabs">' +
        '<li class="active"><a href="#gallery-dialog-browse" data-role="tab">图片库</a></li>' +
        '<li><a href="#gallery-dialog-upload" data-role="tab">上传</a></li>' +
      '</ul>',
    uploadOptions: {
    }
  },

  initTabs: function () {
    var self = this;

    self.tabs = new Tabs({
      element: self.element,
      initialTab: self.option('initialTab'),
      events: {
        tab: function (e, tab, pane) {
          self['init' + tab[0].hash.split('-')[2].replace(/^[a-z]/, function (a) {
            return a.toUpperCase();
          })](pane);
        }
      }
    });
  },

  initUpload: function (pane) {
    var self = this,
        options;

    self.activeTab = 1;
    self.role('foot').hide();

    if (self.upload) {
      return;
    }

    options = self.option('uploadOptions');

    $.extend(true, options, {
      container: pane,
      events: {
        complete: function (e, queueFile) {
          var data = queueFile.data(),
              image = new Image();

          image.onload = function () {
            self.currentPicUrl = data.thumbUrl;
            self.fire('processPic', {
              thumbUrl : data.thumbUrl,
              width: this.width,
              height: this.height,
              remark : data.remark
            });
          };

          image.src = data.thumbUrl;
          self.fire('complete', queueFile);
        }
      }
    });

    self.upload = new Upload(options);

    this.initButton(pane);
  },

  initButton: function (pane) {
    var self = this;

    self.button = new Button({
      container: pane,
      data: {
        icon: 'times',
        label: '关闭窗口'
      },
      delegates: {
        'click': function () {
          self.close();
        }
      },
      disabled: false
    });
  },

  initBrowse: function (pane) {
    var self = this,
        options;

    self.activeTab = 0;
    self.role('foot').show();

    if (self.browse) {
      return;
    }

    options = self.option('galleryOptions');

    $.extend(true, options, {
      element: pane,
      events: {
        diselect: function (e) {
          self.setting.hide();
        },
        select: function (e, data) {
          self.setting.set({
            tags: data.tags,
            remark: data.remark
          });

          self.setting.show();
        },
        load: function (e) {
          self.setting.hide();
        }
      }
    });

    self.browse = new Browse(options);

    self.initSelects();
    self.initSetting();
  },

  initSelects: function () {
    new Select({
      field: this.browse.$('[name=userUploaded]')
    });

    new Select({
      field: this.browse.$('[name=type]')
    });
  },

  initSetting: function  () {
    var self = this;

    self.setting = new Setting({
      classPrefix: 'gallery-setting',
      container: self.browse.element,
      events: {
        render: function () {
          this.$('[name=linkOriginal]').closest('.form-group').hide();
          this.$('[name=tags],[name=remark]').prop('readonly', true);
        }
      }
    });

    self.setting.hide();
  },

  switchTab: function (name) {
    this.tabs.slide(typeof name === 'number' ? name : (name === 'upload') ? 1 : 0);
    this.show();
    this.focus();
  },

  /**
   * 图片处理
   *
   * @return {[type]} [description]
   */
  processPic: function (data) {
    var self = this,
        i = 0, len = 0;

    if (!data || !data.length) {
      new Tips({
        content: '请选择图片'
      });
      return;
    }

    if (Array.isArray(data)) {
      len = data.length;

      data.forEach(function (data) {
        // 魔图
        new Process({
          imageUrl: data.remotePath,
          settings: self.setting.get(),
          events: {
            complete: function (e, thumbUrl) {
              var image = new Image();

              image.onload = function () {
                self.currentPicUrl = thumbUrl;
                self.fire('processPic', {
                  thumbUrl : thumbUrl,
                  width: this.width,
                  height: this.height,
                  remark : data.remark
                });

                if (++i === len) {
                  self.close();
                }
              };

              image.src = thumbUrl;
            }
          }
        });
      });
    } else {
      // 魔图
      new Process({
        imageUrl: data.remotePath,
        settings: self.setting.get(),
        events: {
          complete: function (e, thumbUrl) {
            var image = new Image();

            image.onload = function () {
              self.currentPicUrl = thumbUrl;
              self.fire('processPic', {
                thumbUrl : thumbUrl,
                width: this.width,
                height: this.height,
                remark : data.remark
              });

              self.close();
            };

            image.src = thumbUrl;
          }
        }
      });
    }
  }

});

module.exports = Dialog;

});
