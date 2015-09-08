define(function(require, exports, module) {

  'use strict';

  var Confirm = require('confirm');

  var FixedForm = require('../../../form/fixedform');

  var Previewer = require('./previewer');

  function HTMLToData(imgElm) {
    return {
      src: imgElm ? imgElm.dataset.mcePSrc : '',
      width: imgElm ? imgElm.offsetWidth : 480,
      height: imgElm ? imgElm.offsetHeight : 400
    };
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
        formData = HTMLToData(this.option('imgElm')),
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
          case 'width':
            widthChange(name);
            break;
          case 'height':
            heightChange(name);
            break;
        }
      }


      /**
       * 转换 173 视频 url 为正确的 swf 地址
       * http://v.17173.com/seq/MTgwNzEzMjM/MTE5MDQ2NTg.html
       * http://v.17173.com/v_1_10807/MTE5MDQ2NTg.html
       * http://v.17173.com/v_4_4036601/MTgxODIyNDU.html?vid=sjyx
       * http://v.17173.com/playlist_3352460/MTgyMDkzNTA.html
       * http://f.v.17173cdn.com/player_f2/MTE5MDQ2NTg.swf
       * <embed src="http://f.v.17173cdn.com/player_f2/MTE5MDQ2NTg.swf" allowFullScreen="true" quality="high" width="480" height="400" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>
       * 封面图 api: http://v.17173.com/api/video/vInfo/id/11904658
       */
      function transportFormData() {
        var src = formData.src,
          origin = 'http://v.17173.com/',
          regexp, matched;

        if (src.indexOf(origin) !== 0) {
          return;
        }

        src = src.substring(origin.length);

        regexp = /^(?:(?:v_\d+_\d+)|(?:playlist_\d+)|(?:seq\/[\da-zA-Z]+))\/([\da-zA-Z]+)\.html/;

        if ((matched = src.match(regexp))) {
          formData.src = 'http://f.v.17173cdn.com/player_f2/' + matched[1] + '.swf';
          self.form.setValueOf('src', formData.src);
        }
      }

      function srcChange() {
        // 转换173视频地址
        transportFormData();

        self.previewer.update(formData);
      }

      function widthChange(name) {
        if (formData.width) {
          formData.height = (((formData.width / originalWidth) * originalHeight) | 0);
        } else {
          formData.width = originalWidth;
          formData.height = originalHeight;
        }

        self.form.setValueOf('width', formData.width);
        self.form.setValueOf('height', formData.height);

        self.previewer.update(formData);
      }

      function heightChange(name) {
        if (formData.height) {
          formData.width = (((formData.height / originalHeight) * originalWidth) | 0);
        } else {
          formData.width = originalWidth;
          formData.height = originalHeight;
        }

        self.form.setValueOf('width', formData.width);
        self.form.setValueOf('height', formData.height);

        self.previewer.update(formData);
      }

      function saveChange() {
        self.fire('change', formData);

        self.close();
      }

      this.form = new FixedForm({
        data: {
          groups: [{
            label: '地址',
            attrs: {
              type: 'text',
              name: 'src',
              value: formData.src || 'http://',
              placeholder: 'http://',
              required: 'required',
              url: 'url',
              v17173 : 'v17173'
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
        customMessages : {
          v17173 : '请输入17173视频'
        },
        customRules : {
          v17173 : function(params){
            return /(v\.17173\.com\/)|(\/f\.v\.17173cdn\.com\/)/.test(params.value);
          }
        },
        xhr: false
      });
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

});
