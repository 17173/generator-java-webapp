'use strict';

/**
 * 树查询
 */

var $ = require('jquery');

var io = require('../io');
var SearchCore = require('./core');

require('ztree-v3')($);

var TreeSearch = SearchCore.extend({
  defaults: {
    element: 'J_SearchTree',
    treeCfg: {
      rootNodeText: null,
      key: {
        children: 'children',
        name: 'name'
      }
    },
    delegates: {

    }
  },

  onSearch: function(e) {
    if (e) {
      e.preventDefault();
    }

    if (!this.form) {
      this.renderTree();
    }

    return false;
  },

  refresh: function() {
    this.renderTree();
  },

  initGrid: function() {
    if (!this.treeElement) {
      this.treeElement = $(this.option('treeElement'));
    }

    if (!this.treeElement.length) {
      this.treeElement = $('<ul id="ztree" class="ztree"/>').insertAfter(this.formElement);
    }

    this.renderTree();
  },

  renderTree: function() {
    var self = this;
    var keyChildren = self.option('treeCfg/key/children');
    var keyName = self.option('treeCfg/key/name');
    var setting = {
      data: {
        key: {
          name: keyName,
          children: keyChildren
        }
      },
      callback: self.option('treeCfg/callback')

    };
    io.get(this.option('url'), this.getParams(), function() {
      var nodes = this.data || [];
      var disposeNodes = self.option('disposeNodes');
      var rootNodeText = self.option('treeCfg/rootNodeText');

      if (!nodes.length) {
        self.treeElement.html('<li>抱歉，没有找到符合条件的信息。</li>');
        return false;
      }

      if (typeof disposeNodes === 'function') {
        nodes = disposeNodes(nodes);
      }
      if (rootNodeText && nodes) {
        var tempNodes = nodes;
        nodes = {
          id: 0
        };
        nodes[keyName] = rootNodeText;
        nodes[keyChildren] = tempNodes;
        tempNodes = null;
      }

      $.fn.zTree.init($('#ztree'), setting, nodes);
    });

  }


});

module.exports = TreeSearch;
