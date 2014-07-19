define(function (require, exports, module) {

'use strict';

var Confirm = require('confirm');

var NarrowForm = require('common/form/narrowform');

var Previewer = require('./previewer');

function HTMLToData(imgElm) {
  if (imgElm) {
    return {
      src: imgElm.dataset.mcePSrc,
      width: +imgElm.dataset.mcePWidth,
      height: +imgElm.dataset.mcePHeight
    };
    // new tinymce.html.SaxParser({
    //   validate: false,
    //   'allow_conditional_comments': true,
    //   // special: 'script,noscript',
    //   start: function(name, attrs) {
    //     if (name === 'embed') {
    //       data = tinymce.extend(attrs.map, data);
    //     }
    //   }
    // }).parse(editor.serializer.serialize(imgElm, {selection: true}));
  } else {
    return {
      src: '',
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
        case 'width':
          widthChange(name);
          break;
        case 'height':
          heightChange(name);
          break;
      }
    }

    function srcChange() {
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
              url: 'url'
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
