  'use strict';

  var Dom = function(node) {
    this.node = node;
  };

  Dom.prototype = {

    css: function(obj) {
      var p,
        style = this.node.style;

      for (p in obj) {
        style[p] = obj[p];
      }

      return this;
    },

    attr: function(obj) {
      var p;

      for (p in obj) {
        if (obj[p] === null) {
          this.node.removeAttribute(p);
        } else {
          this.node.setAttribute(p, obj[p]);
        }
      }

      return this;
    },

    remove: function() {
      this.node.remove();
      return this;
    },

    replace: function(target) {
      this.before(target);
      this.remove();

      target.__DOM = this;
      this.node = target;

      return this;
    },

    swap: function(target) {
      var caret;

      if (target.constructor === Dom) {
        this.swap(target.node);
        this.node.__DOM = target;
        target.node = this.node;
      } else {
        caret = target.nextSibling;

        this.before(target);

        if (caret) {
          this.insertBefore(caret);
        } else {
          this.node.parentNode.appendChild(this.node);
        }

        target.__DOM = this;
        this.node = target;
      }

      return this;
    },

    append: function(target) {
      this.node.appendChild(target);
      return this;
    },

    prepend: function(target) {
      var node = this.node;

      if (node.firstChild) {
        dom(node.firstChild).before(target);
      } else {
        this.append(target);
      }

      return this;
    },

    before: function(target) {
      var node = this.node,
        parentNode = node.parentNode;

      if (!parentNode) {
        return this;
      }

      parentNode.insertBefore(target, node);

      return this;
    },

    after: function(target) {
      var node = this.node,
        parentNode = node.parentNode;

      if (!parentNode) {
        return this;
      }

      if (node.nextSibling) {
        parentNode.insertBefore(target, node.nextSibling);
      } else {
        parentNode.appendChild(target);
      }

      return this;
    },

    insertBefore: function(target) {
      dom(target).after(this.node);

      return this;
    },

    insertAfter: function(target) {
      dom(target).before(this.node);

      return this;
    }

  };

  var dom = function(node) {
    if (!node) {
      throw new Error('请指定 node ！');
    }

    if (typeof node === 'string') {
      node = document.createElement(node);
    }

    if (!node.__DOM) {
      node.__DOM = new Dom(node);
    }

    return node.__DOM;
  };

  module.exports = dom;

