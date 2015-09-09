define(function(require, exports, module) {

  'use strict';

  var DialogForm = require('../../../form/dialogform');

  function HTMLToData(anchorElm) {
    if (anchorElm) {
      return {
        href: anchorElm.href,
        text: anchorElm.textContent,
        title: anchorElm.title,
        target: anchorElm.target
      };
    } else {
      return {
        href: '',
        text: '',
        title: '',
        target: ''
      };
    }
  }

  var Modifier = DialogForm.extend({

    defaults: {
      css: {
        // position: 'absolute',
        width: 480
      },
      formOptions: {
        xhr: false
      }
    },

    setup: function() {
      var anchorElm = this.option('anchorElm'),
        formData = HTMLToData(anchorElm);

      if (this.option('onlyText')) {
        if (!anchorElm) {
          formData.text = this.option('selectedText');
        }
      } else {
        formData.text = false;
      }

      this.generateGroup(formData);

      Modifier.superclass.setup.apply(this);
    },

    generateGroup: function(formData) {
      var groups = [];

      function generateHref() {
        groups.push({
          label: '地址',
          attrs: {
            type: 'text',
            name: 'href',
            value: formData.href || 'http://',
            placeholder: 'http://',
            maxlength: 100,
            required: 'required'/*,
            url: 'url'*/
          }
        });
      }

      function generateText() {
        if (formData.text === false) {
          return;
        }

        groups.push({
          label: '文字',
          attrs: {
            type: 'text',
            name: 'text',
            value: formData.text,
            // placeholder: '',
            required: 'required',
            maxlength: 100
          }
        });
      }

      function generateTitle() {
        groups.push({
          label: '标题',
          attrs: {
            type: 'text',
            name: 'title',
            value: formData.title,
            // placeholder: '',
            maxlength: 100
          }
        });
      }

      function generateTarget() {
        groups.push({
          label: '目标',
          attrs: {
            type: 'select',
            name: 'target'
          },
          options: [{
            text: '无',
            value: '',
            selected: !formData.target
          }, {
            text: '在新窗口打开',
            value: '_blank',
            selected: formData.target === '_blank'
          }]
        });
      }

      generateHref();
      generateText();
      generateTitle();
      generateTarget();

      this.option('formOptions/data/groups', groups);
    }

  });

  module.exports = Modifier;

});
