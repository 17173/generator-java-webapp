  'use strict';

  var EditHtml = require('../../../../component/instance/edithtml');

  var EditDialog = EditHtml.extend({
    defaults: {
      delegates: {
        'change [name=state]': function(e) {
          var isnew = (e.currentTarget.value === 'saveas');

          this.form.name('componentName')
            .attr('disabled', !isnew)
            .closest('.form-group').toggle(isnew);

          this.updateUrl(isnew ? 'componentAdd' : 'componentUpdate');
        }
      },
      events: {
        formData: function(e) {
          var formData = e.target.formData,
            state = formData.get('state');

          formData.append('componentType', '1');
          formData.append('status', '2');
          formData.append('dataType', 'html');

          if(this.$('[name=state][value=update]').is(':checked')){
            formData.append('componentName' ,this.componentName);
          }

          formData.remove('state');

          if (state === 'saveas') {
            formData.remove('id');
          } else {
            if (this.option('id')) {
              formData.append('id', this.option('id'));
              formData.append('channelId', window.CMS_USER_DATA.CHANNEL_ID);
            }
          }
        },
        render: function(e) {
          this.form.name('componentName')
            .closest('.form-group').hide();
        }
      }
    },

    generateFormGroup: function(data) {
      data || (data = {});
      this.componentName = data.componentName;
      return [{
        label: 'HTML代码',
        value: data.content,
        attrs: {
          type: 'multiline',
          name: 'content',
          required: 'required'
        }
      }, {
        label: '状态',
        attrs: {
          required: 'required'
        },
        groups: [{
          label: '更新',
          attrs: {
            type: 'radio',
            name: 'state',
            value: 'update',
            checked: 'checked'
          }
        }, window.AUTH.isAuth('componentInstanceListAdd') ? {
          label: '另存',
          attrs: {
            type: 'radio',
            name: 'state',
            value: 'saveas'
          }
        } : undefined]
      }, {
        label: '组件名称',
        attrs: {
          type: 'text',
          name: 'componentName',
          required: 'required',
          maxlength: 30,
          disabled: 'disabled'
        }
      }];
    },

    updateUrl: function(url) {
      this.form.option('url', url);
      this.form.xhr && this.form.xhr.option('url', url);
    }

  });

  module.exports = EditDialog;

