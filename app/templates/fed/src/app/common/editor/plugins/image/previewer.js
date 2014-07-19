define(function (require, exports, module) {

'use strict';

var Widget = require('widget');

var maxWidth = 300,
    maxHeight = 300;

var Previewer = Widget.extend({

  defaults: {
    css: {
      marginTop: '10px',
      padding: '10px',
      color: '#ccc',
      backgroundColor: '#eee',
      textAlign: 'center',
      verticalAlign: 'middle',
      borderRadius: '4px'
    },
    data: {},
    template: require('./previewer.handlebars')
  },

  setup: function () {
    this.render();
  },

  update: function (formData) {
    var self = this,
        data = this.data(),
        scaleRatio = 1;

    if (formData.src) {
      if (formData.width > maxWidth) {
        scaleRatio = maxWidth / formData.width;
      }

      if (formData.height > maxHeight) {
        scaleRatio = Math.min(maxHeight / formData.height, scaleRatio);
      }

      data.src = formData.src;
      data.alt = formData.alt;
      data.width = formData.width * scaleRatio;
      data.height = formData.height * scaleRatio;
    } else {
      data.src = '';
    }

    this.render();
  }

});

module.exports = Previewer;

});
