  'use strict';

  var Tips = require('pandora-tips'),
    Select = require('pandora-select');

  var util = require('../util'),
    DialogTab = require('../dialogtab/dialogtab');

  var Setting = require('../magickimg/setting'),
    Process = require('../magickimg/process'),
    Button = require('../button/button');

  var Upload = require('./upload/processupload'),
    Browse = require('./browse/browse');

  /**
   * 弹窗图片库
   *
   * @module common/image/dialog
   * @class  Dialog
   * @constructor
   * @extends DialogTab
   */
  var Dialog = DialogTab.extend({

    defaults: {
      data: {
        tabs: [{
          id: 'gallery-dialog-browse',
          name: '图片库'
        }, {
          id: 'gallery-dialog-upload',
          name: '本地上传'
        }]
      },
      // 图片列表配置
      galleryOptions: {
        buttons: null,
        keepHistory: false,
        keyMaps: {
          title: 'name',
          url: 'remotePath',
          id: 'fid',
          description: 'remark'
        },
        // element: '#J_GallerySearch',
        pageSize: 10,
        selectable: 'single',
        url: 'imageSearch'
      },
      // 是否获取图片真实尺寸
      needDimens: false,
      title: '选择图片',
      // 图片上传配置
      uploadOptions: {
        selectOptions: {
          multiple: true
        }
      }
    },

    setup: function() {
      // 绑定提交事件回调
      this.submit(function() {
        this.processPic(this.browse.getSelectedData());
        return false;
      });

      // tab 切换
      this.on('tab', function(e, tab, pane) {
        this['init' + tab[0].hash.split('-')[2].replace(/^[a-z]/, function(a) {
          return a.toUpperCase();
        })](pane);
      });

      // 阻止销毁
      this.before('destroy', function() {
        // 阻止 Confirm 的关闭后自动销毁
        return false;
      });

      Dialog.superclass.setup.apply(this);
    },

    switchTab: function(name) {
      this.tabs.slide(typeof name === 'number' ? name : (name === 'upload') ? 1 : 0);
      this.show();
      this.focus();
    },

    initUpload: function(pane) {
      var self = this,
        options;

      self.activeTab = 1;
      self.role('foot').hide();

      if (self.upload) {
        return;
      }

      options = self.option('uploadOptions');

      util.copy(options, {
        container: pane,
        events: {
          complete: function(e, queueFile, settings) {
            self.processPic([queueFile.data()], true, settings);
          },
          error: function(e, msg) {
            new Tips({
              content: msg
            });
          }
        },
        hasLink: self.option('hasLink')
      });

      options.defaultWidth = self.option('defaultWidth');

      self.upload = new Upload(options);

      this.initUploadCloseButton(pane);
    },

    initUploadCloseButton: function(pane) {
      var self = this;

      self.button = new Button({
        container: pane,
        data: {
          icon: 'times',
          label: '关闭窗口'
        },
        delegates: {
          'click': function() {
            self.close();
          }
        },
        disabled: false
      });
    },

    initBrowse: function(pane) {
      var self = this,
        options;

      self.activeTab = 0;
      self.role('foot').show();

      if (self.browse) {
        return;
      }

      options = self.option('galleryOptions');

      util.copy(options, {
        element: pane,
        events: {
          diselect: function(e) {
            self.hideBrowseSetting();
          },
          select: function(e, data) {
            self.showBrowseSetting(data);
          },
          load: function(e) {
            self.hideBrowseSetting();
          }
        }
      });

      self.browse = new Browse(options);

      self.initBrowseSelects();
    },

    initBrowseSelects: function() {
      var self = this,
        browse = self.browse;

      new Select({
        field: browse.$('[name=userUploaded]'),
        hasLabel: false,
        events: {
          change: function() {
            var form = browse.form;
            form.$('[name=pageNo]').val(1);
            form.submit();
          }
        }
      });

      new Select({
        field: browse.$('[name=type]')
      });
    },

    showBrowseSetting: function(data) {
      if (!this.setting) {
        this.setting = new Setting({
          classPrefix: 'gallery-setting',
          container: this.browse.element,
          data: data,
          filterData: data,
          hasLink: this.option('hasLink'),
          defaultWidth : this.option('defaultWidth'),
          simplex: true
        });
      } else {
        this.setting.filter(this.calSelectedFilterData(this.browse.getSelectedData()));
      }

      this.setting.show();
    },

    hideBrowseSetting: function() {
      if (this.setting &&
        this.browse.getSelectedData().length === 0) {
        this.setting.hide();
      }
    },

    /**
     * 图片处理
     */
    processPic: function(datas, processed, settings) {
      var self = this,
        i = 0,
        len = 0;

      function loadImage(data, callback, settings) {
        var tries = 0,
          maxTries = 10,
          cals;

        function cal(data, toData) {
          var width = data.width,
            height = data.height;

          if (!!toData.width) {
            height = toData.width * height / width;
            width = toData.width;
          }

          return {
            width: width,
            height: height
          };
        }

        function fire(data, width, height) {
          data.thumbWidth = width;
          data.thumbHeight = height;

          self.fire('processPic', {
            name: data.name,
            remotePath: data.remotePath,
            thumbUrl: data.thumbUrl,
            width: data.thumbWidth || data.width,
            height: data.thumbHeight || data.height,
            remark: data.remark,
            linkOriginal: data.linkOriginal,
            sequence : data.sequence
          }, processed);
        }

        function getDimens() {
          var image = new Image();

          image.onload = function() {
            self.currentPicUrl = data.thumbUrl;
            fire(data, this.width, this.height);

            if (++i === len) {
              if (callback) {
                callback.call(self);
              }
            }
          };

          image.onerror = function() {
            if (tries++ < maxTries) {
              getDimens();
            } else {
              // 多次尝试，还是取不到真是尺寸，则正常返回
              cals = cal(data, settings);
              fire(data, cals.width, cals.height);
              // new Tips({
              //   content: '图片读取失败，请检查'
              // });
              if (++i === len) {
                if (callback) {
                  callback.call(self);
                }
              }
            }
          };

          image.src = data.thumbUrl;
        }

        if (self.option('needDimens')) {
          getDimens();
        } else {
          fire(data);
          if (callback) {
            callback.call(self);
          }
        }
      }

      if (!datas || !datas.length) {
        new Tips({
          content: '请选择图片'
        });
        return;
      }

      len = datas.length;

      // 从上传口过来，已处理
      if (processed) {
        settings || (settings = {});
        datas.forEach(function(data) {
          if (settings) {
            if (settings.linkOriginal) {
              data.linkOriginal = settings.linkOriginal;
            }
            if (settings.remark) {
              data.remark = settings.remark;
            }
          }
          loadImage(data, function() {
            self.fire('complete');
          }, settings);
        });
      } else {
        // 从图库选择口过来
        datas.forEach(function(data, i) {
          var settings = self.setting.get();

          // 魔图
          new Process({
            imageUrl: data.remotePath,
            settings: settings,
            events: {
              complete: function(e, thumbUrl) {
                data.thumbUrl = thumbUrl;
                data.linkOriginal = settings.linkOriginal;
                data.sequence = i;
                loadImage(data, function() {
                  self.close();
                }, settings);
              },
              error: function(e, msg) {
                new Tips({
                  content: msg
                });
              }
            }
          });
        });
      }
    },

    calSelectedFilterData: function(selectedData) {
      var width = 1e6,
        height = 1e6;

      selectedData.forEach(function(data) {
        width = Math.min(width, data.width);
        height = Math.min(height, data.height);
      });

      return {
        width: width,
        height: height
      };
    }

  });

  module.exports = Dialog;

