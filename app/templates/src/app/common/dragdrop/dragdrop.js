define(function(require, exports, module) {

  'use strict';

  var $ = require('$'),
    Widget = require('widget');

  function getRealOffset(e, dropTarget) {
    var originalEvent = e.originalEvent,
      elemOffset = $(originalEvent.target).offset(),
      dropOffset = $(dropTarget).offset();

    return {
      top: (originalEvent.offsetY + elemOffset.top) - dropOffset.top,
      left: (originalEvent.offsetX + elemOffset.left) - dropOffset.left
    };
  }

  function getDropGravity(e, dropTarget) {
    var realOffset = getRealOffset(e, dropTarget);

    return ((realOffset.top < dropTarget.offsetHeight / 2) ? 'top' : 'bottom') +
      ((realOffset.left < dropTarget.offsetWidth / 2) ? 'left' : 'right');
  }

  var DragDrop = Widget.extend({

    defaults: {
      classPrefix: 'ue-dragdrop',
      container: null,
      // delegates: { },
      dragEffect: 'all',
      dropEffect: 'all',
      // 需要计算拖放位置（上下左右）
      getGravity: true
    },

    // setup: function () {
    //   this.getGravity = this.option('getGravity');
    // },

    dragStart: function(e) {
      // console.log(e.type, e.currentTarget, this.dropTarget);
      // 阻止冒泡到父辈
      e.stopPropagation();

      if (this.fire('beforeDragStart', e)) {
        this.dragTarget = e.currentTarget;
        this.setDragEffect(e);
        this.fire('dragStart', e);
      } else {
        e.preventDefault();
      }
    },

    // drag: function(e) {
    //   // console.log(e.type, e.currentTarget, this.dropTarget);

    //   if (this.fire('beforeDrag', e)) {
    //     this.fire('drag', e);
    //   }
    // },

    dragEnter: function(e) {
      // console.log(e.type, e.currentTarget, this.dropTarget);
      // 阻止冒泡到父辈
      e.stopPropagation();

      if (!this.dragTarget) {
        return;
      }

      if (this.dragTarget === e.currentTarget) {
        return;
      }

      if (this.fire('beforeDragEnter', e)) {
        // 需要通知离开前一个 dropTarget
        if (this.dropTarget) {
          this.fire('dragLeave', e);
        }

        this.dropTarget = e.currentTarget;
        delete this.dropGravity;
        this.fire('dragEnter', e);
      }
    },

    dragOver: function(e) {
      // console.log(e.type, e.currentTarget, this.dropTarget);
      e.preventDefault();

      if (!this.dragTarget || !this.dropTarget) {
        return;
      }

      // 不需要计算拖放位置（上下左右），则不通知 dragOver
      if (!this.option('getGravity')) {
        return;
      }

      if (this.dropTarget) {
        var dropGravity = getDropGravity(e, this.dropTarget);

        if (dropGravity !== this.dropGravity) {
          if (this.fire('beforeDragOver', e)) {
            this.dropGravity = dropGravity;
            this.setDropEffect(e);
            this.fire('dragOver', e);
          }
        }
      }
    },

    dragLeave: function(e) {
      if (!this.dragTarget || !this.dropTarget) {
        return;
      }

      if (this.dropTarget !== e.currentTarget) {
        if (this.fire('beforeDragLeave', e)) {
          this.fire('dragLeave', e);

          delete this.dropGravity;
          delete this.dropTarget;
        }
      }
    },

    drop: function(e) {
      // console.log(e.type, e.currentTarget, this.dropTarget);
      if (!this.dragTarget || !this.dropTarget) {
        return;
      }

      // e.preventDefault();
      e.stopPropagation();

      if (this.dragTarget !== this.dropTarget) {
        if (this.fire('beforeDrop', e)) {
          this.fire('drop', e);
        }
      }
    },

    dragEnd: function(e) {
      // console.log(e.type, e.currentTarget, this.dropTarget);
      // if (!this.dragTarget || !this.dropTarget) {
      //   return;
      // }

      if (this.fire('beforeDragEnd', e)) {
        this.fire('dragEnd', e);

        delete this.dragTarget;
        delete this.dropTarget;
        delete this.dropGravity;
      }
    },

    setDragEffect: function(e, dragEffect) {
      e.originalEvent.dataTransfer.effectAllowed = dragEffect || this.option('dragEffect');
    },

    setDropEffect: function(e, dropEffect) {
      e.originalEvent.dataTransfer.dropEffect = dropEffect || this.option('dropEffect');
    }

  });

  module.exports = DragDrop;

});
