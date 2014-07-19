define(function (require, exports, module) {

'use strict';

var Confirm = require('confirm');

var NarrowForm = require('common/form/narrowform');

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
      width: 360
    },
    events: {
      submit: function () {
        this.form.submit();
        return false;
      }
    }
  },

  initForm: function () {
    var self = this,
        formData = HTMLToData(this.option('imgElm')),
        originalWidth = formData.width,
        originalHeight = formData.height;

    function dataChange (e, elem, fromForm) {
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
      var image;

      if (!formData.src) {
        self.previewer.update(formData);
        return;
      }

      image = new Image();

      image.onload = function () {
        formData.width = image.width;
        formData.height = image.height;

        image.remove();

        self.previewer.update(formData);
      };

      image.onerror = function () {
        alert('图片地址读取失败，请检查');
      };

      image.src = formData.src;
    }

    function altChange() {
      // formData.alt = window.encodeURIComponent(formData.alt.replace(/'/g, '\\\''));

      self.previewer.update(formData);
    }

    function widthChange (name) {
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

    function heightChange (name) {
      var data;

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

    function saveChange () {
      self.fire('change', formData);

      self.close();
    }

    this.form = new NarrowForm({
      data: {
        groups: [
          {
            label: '地址',
            attrs: {
              type: 'text',
              name: 'src',
              value: formData.src || 'http://',
              placeholder: 'http://',
              required: 'required',
              maxlenth: 100,
              url: 'url'
            }
          },
          {
            label: '描述',
            attrs: {
              type: 'text',
              name: 'alt',
              value: formData.alt,
              // placeholder: '',
              required: 'required',
              maxlenth: 100
            }
          },
          {
            label: '尺寸',
            flex: true,
            groups: [
              {
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
              },
              {
                value: '&times;',
                colspan: '0'
              },
              {
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
              }
            ]
          }
        ]
      },
      events: {
        render: function () {
          self.previewer.update(formData);
        },
        valid: saveChange,
        elemValid: dataChange
      },
      xhr: false
    });
  },

  initPreviewer: function () {
    this.previewer = new Previewer();
  },

  setup: function () {
    var self = this;

    self.initPreviewer();
    self.initForm();

    self.option('children', [self.form, self.previewer]);

    Modifier.superclass.setup.apply(self);
  }
});

module.exports = Modifier;

});
