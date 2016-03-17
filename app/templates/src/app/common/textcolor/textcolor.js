  //文字颜色选择

  'use strict';

  var $ = require('jquery'),
    Widget = require('pandora-widget');


  var TextColor = Widget.extend({
    defaults: {
      field: null,
      classPrefix: 'ue-textcolor',
      template: require('./textcolor.handlebars'),
      insert : function(){
        this.field.after(this.element);
      },
      delegates: {
        'click': function(e) {
          if(e.target != this.inputColor[0]){
            this.inputColor.click();
          }
        },

        'click [data-role=remove]' : function(e){
          this.inputColor.val('');
          this.field.val('');
          this.role('remove').hide();
          e.stopPropagation();
          this.fire('change');
          return false;
        },

        'change [data-role=inputColor]': function(e) {
          this.field.val(e.currentTarget.value);
          this.role('remove').show();
          this.fire('change');
        }
      }
    },

    setup: function() {
      var field = this.option('field');
      if (!field) {
        throw new Error('请设置field');
      }
      this.field = $(field).hide();
      this.render();
      this.init();
    },

    init: function() {
      var value;
      this.inputColor = this.role('inputColor');
      value = this.field.val();
      if (value) {
        this.inputColor.val(value);
        this.role('remove').show();
      }
    }

  });

  module.exports = TextColor;
