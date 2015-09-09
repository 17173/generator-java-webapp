define(function(require, exports, module) {

  /**
   * 组图图片列表
   */

  'use strict';

  var $ = require('$');
  var Widget = require('widget');

  var util = require('../util'),
    DragDrop = require('../dragdrop/dragdrop');

  var Photo = Widget.extend({
    defaults: {
      data : {
        photos : []
      },
      delegates: {
        'click [data-role=remove]': 'remove'
      },
      field: '',
      insert: function() {
        if (this.field) {
          this.field.after(this.element);
        } else {
          this.container.length && this.container.append(this.element);
        }
      },
      template: require('./photos.handlebars')
    },

    setup: function() {
      var field = this.option('field'),
        value, datas;

      if (field) {
        this.field = $(field).hide();
        value = this.field.val().trim();
        if (value !== '') {
          value = JSON.parse(value);
          this.data('photos', value);
        }
      }
      datas = this.option('data/photos');
      datas.forEach(function(item) {
        item.thumbUrl = util.transThumb(item.imgUrl);
      });
      this.render();
      this.initDragDrop();
    },

    render: function() {
      Photo.superclass.render.apply(this);
      this.updateNumber();
      this.setValue();
    },

    remove: function(e) {
      $(e.currentTarget).closest('.release-photo-item').remove();
      this.setValue();
    },

    setValue: function() {
      var data;

      if (!this.field) {
        return;
      }

      data = this.getData();
      this.field.val(data.length ? JSON.stringify(data) : '');
      this.field.change();
    },

    //添加组图
    addPhotos: function(list) {
      var photos = this.option('data').photos = this.getData();

      this.uneq(photos, list, 'imgUrl');
      this.render();
    },

    //过滤重复
    uneq: function(a1, a2, attr) {
      for (var i = 0; i < a2.length; i++) {
        for (var j = 0; j < a1.length; j++) {
          if (a1[j][attr] === a2[i][attr]) {
            break;
          }
        }
        if (j >= a1.length) {
          a2[i].thumbUrl = util.transThumb(a2[i].imgUrl);
          a1.push(a2[i]);
        }
      }
    },

    //获取数据
    getData: function() {
      var datas = [];

      this.$('.release-photo-item').each(function(i, v) {
        v = $(v);
        datas.push({
          description: v.find('[data-role=description]').val(),
          imgUrl: v.find('[data-role=imgUrl]').attr('data-imgUrl'),
          thumbUrl: v.find('[data-role=imgUrl]').attr('src'),
          priority: i
        });
      });

      return datas;
    },

    clearData: function() {
      this.data('photos', [], true);
      this.render();
    },

    //重置编号
    updateNumber: function() {
      this.role('number').each(function(i) {
        $(this).text(i + 1);
      });
    },

    //初始化拖
    initDragDrop: function() {
      var self = this;
      var clientX = 0;

      new DragDrop({
        delegates: {
          'dragstart [cms-draggable=top]': 'dragStart',
          'dragenter [cms-droppable=top]': 'dragEnter',
          'dragover [cms-droppable=top]': 'dragOver',
          'dragleave [cms-droppable=top]': 'dragLeave',
          'drop [cms-droppable=top]': 'drop',
          'dragend': 'dragEnd'
        },
        dragEffect: 'move',
        dropEffect: 'move',
        element: this.element,
        events: {
          dragStart: function(e) {
            var dragTarget = $(this.dragTarget);
            var ghostTarget = this.ghostTarget = document.createElement('li');
            ghostTarget.setAttribute('class', 'release-photo-item');
            ghostTarget.setAttribute('cms-droppable', 'top');
            ghostTarget.style.height = dragTarget.outerHeight() + 'px';
            ghostTarget.style.width = dragTarget.outerWidth() + 'px';
            ghostTarget.style.border = '1px dashed #357ebd';
          },
          dragOver: function(e, event) {
            this.dragTarget && $(this.dragTarget).hide();
            if (event.originalEvent.clientX > clientX) {
              $(this.ghostTarget).insertAfter(this.dropTarget);
            } else {
              $(this.ghostTarget).insertBefore(this.dropTarget);
            }
            clientX = event.originalEvent.clientX;
          },
          dragEnd: function(e) {
            if($(this.ghostTarget).is(':visible')){
              $(this.dragTarget).insertBefore(this.ghostTarget);
              this.dragTarget && $(this.dragTarget).show();
              self.updateNumber();
            }
            $(this.ghostTarget).remove();
          }
        }
      });
    }

  });

  module.exports = Photo;

});
