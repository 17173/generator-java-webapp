  'use strict';

  var Confirm = require('pandora-confirm'),
    Tips = require('pandora-tips');

  var FixedForm = require('../../../form/fixedform');

  var Previewer = require('./previewer');

  function HTMLToData(imgElm) {
    if (imgElm) {
      return {
        src: imgElm.src,
        alt: imgElm.alt,
        width: imgElm.width,
        height: imgElm.height
      };
    } else {
      return {
        src: '',
        alt: '',
        width: 480,
        height: 300
      };
    }
  }

  var Modifier = Confirm.extend({

    defaults: {
      css: {
        position: 'absolute',
        width: 480
      },
      events: {
        submit: function() {
          this.form.submit();
          return false;
        }
      }
    },

    initForm: function() {
      var self = this,
        imgElm = self.option('imgElm'),
        formData = HTMLToData(imgElm),
        originalWidth = formData.width,
        originalHeight = formData.height;

      function dataChange(e, elem, fromForm) {
        var name = elem.prop('name');

        formData[name] = elem.val();

        if (fromForm) {
          return;
        }

        switch (name) {
          case 'src':
            srcChange();
            break;
          case 'alt':
            altChange();
            break;
          case 'width':
            widthChange(name);
            break;
          case 'height':
            heightChange(name);
            break;
        }
      }

      function srcChange() {
        if (!formData.src) {
          self.previewer.update(formData);
          return;
        }

        updateImage(formData.src, function() {
          self.previewer.update(formData);
        });
      }

      function altChange() {
        // formData.alt = window.encodeURIComponent(formData.alt.replace(/'/g, '\\\''));

        self.previewer.update(formData);
      }

      function widthChange(name) {
        if (formData.width) {
          formData.height = (((formData.width / originalWidth) * originalHeight) | 0);
        } else {
          formData.width = originalWidth;
          formData.height = originalHeight;
        }

        self.$('[name=width]').val(formData.width);
        self.$('[name=height]').val(formData.height);

        self.previewer.update(formData);
      }

      function heightChange(name) {
        if (formData.height) {
          formData.width = (((formData.height / originalHeight) * originalWidth) | 0);
        } else {
          formData.width = originalWidth;
          formData.height = originalHeight;
        }

        self.$('[name=width]').val(formData.width);
        self.$('[name=height]').val(formData.height);

        self.previewer.update(formData);
      }

      function saveChange() {
        self.fire('change', formData);

        self.close();
      }

      function updateImage(src, callback) {
        var image = new Image();

        image.onload = function() {
          originalWidth = formData.width = this.width;
          originalHeight = formData.height = this.height;

          self.$('[name=width]')
            .val(originalWidth)
            .attr('max', originalWidth);

          self.$('[name=height]')
            .val(originalHeight)
            .attr('max', originalHeight);

          image.remove();

          if (callback) {
            callback.call(self);
          }
        };

        image.onerror = function() {
          new Tips({
            content: '图片读取失败，请检查'
          });
        };

        image.src = src;
      }

      self.form = new FixedForm({
        data: {
          groups: [{
            label: '地址',
            attrs: {
              type: 'text',
              name: 'src',
              value: formData.src || 'http://',
              placeholder: 'http://',
              required: 'required',
              maxlength: 100,
              url: 'url'
            }
          }, {
            label: '描述',
            attrs: {
              type: 'text',
              name: 'alt',
              value: formData.alt,
              // placeholder: '',
              required: 'required',
              maxlength: 100
            }
          }, {
            label: '尺寸',
            attrs: {
              required: 'required'
            },
            flex: true,
            groups: [{
              // label: '宽',
              colspan: '6',
              attrs: {
                type: 'number',
                name: 'width',
                value: formData.width,
                max: 9999,
                placeholder: '宽',
                required: 'required'
              }
            }, {
              value: '&times;',
              colspan: '0',
              attrs: {
                type: 'static'
              }
            }, {
              // label: '高',
              colspan: '6',
              attrs: {
                type: 'number',
                name: 'height',
                value: formData.height,
                max: 9999,
                placeholder: '高',
                required: 'required'
              }
            }]
          }]
        },
        events: {
          render: function() {
            self.previewer.update(formData);
          },
          valid: saveChange,
          elemValid: dataChange
        },
        xhr: false
      });

      if (imgElm) {
        updateImage(imgElm.src);
      }
    },

    initPreviewer: function() {
      this.previewer = new Previewer();
    },

    setup: function() {
      var self = this;

      self.initPreviewer();
      self.initForm();

      self.option('children', [self.form, self.previewer]);

      Modifier.superclass.setup.apply(self);
    }
  });

  module.exports = Modifier;

