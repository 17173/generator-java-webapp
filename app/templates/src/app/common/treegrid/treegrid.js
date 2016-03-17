  'use strict';

  /**
   * 分类树表格
   *
   * @module common/treegrid
   */

  var $ = require('jquery');
  var Handlebars = require('handlebars')['default'];
  var moment = require('moment');
  var Dialog = require('pandora-dialog');
  var Alert = require('pandora-alert');

  var io = require('../io');
  var SearchCore = require('../search/core');

  var buttonBarTemplate = [];
  buttonBarTemplate.push('<div class="text-center" style="display: none">');
  buttonBarTemplate.push('  <button type="button" class="btn btn-default" data-role="load"><i class="fa fa-caret-down"></i> 查看更多分类</button>');
  buttonBarTemplate.push('</div>');
  buttonBarTemplate = buttonBarTemplate.join('');


  /**
   * [TreeGrid description]
   * @type {[type]}
   */
  var TreeGrid = SearchCore.extend({
    defaults: {
      element: '#J_Search',
      classPrefix: 'ue-datagrid',
      container: null,
      // 树展开的字段
      treeKey: 'name',
      // 分类类型 1 ＝ 系统分类， 2 = 模板分类
      type: 1,
      url: null,
      // 读缓存数据
      cache: true,
      // 展开
      expanderExpandedClass: 'fa fa-caret-down',
      // 收起
      expanderCollapsedClass: 'fa fa-caret-right',
      gridElement: null,
      // 显示加载等待
      showLoading: true,
      // 加载等待模板
      loadingTemplate: '<div class="grid-loading"><i class="fa fa-spinner"></i> 数据加载中...</div>',
      // 空数据模板
      emptyTemplate: '<p class="text-warning">抱歉，没有找到符合条件的信息。</p>',
      // Handlebar helpers
      gridHelpers: {
        treeIndent: function(level) {
          level = parseInt(level, 10);
          var result = '';
          if (level > 1) {
            for (var i = 1; i < level; i++) {
              result += '<span class="treegrid-indent"></span>';
            }
          }
          return new Handlebars.SafeString(result);
        },
        formatTime: function(val) {
          return moment(val).format('YYYY-MM-DD');
        },

        treeLeaf: function(url, val, level) {
          level = parseInt(level, 10);
          var indent = [];
          var category = '<a class="treegrid-cell-name" href="' + url + '">' + val + '</a>';
          var backLevel = level;
          while (level) {
            level--;
            indent.push('<span class="treegrid-indent"></span>');
          }
          // 非一级的加折线
          if (backLevel > 1) {
            indent[indent.length - 1] = '<span class="treegrid-icon-bevel"></span>';
          }
          indent = indent.join('');
          val = val || '';
          val = val.length <= 20 ? val : val.slice(0, 20) + '&hellip;';
          if (url === '' || !url) {
            category = '<span class="treegrid-cell-name">' + val + '</span>';
          }

          return indent + category;

        },
        renderCategory: function(url, val) {
          val = val || '';
          val = val.length <= 20 ? val : val.slice(0, 20) + '&hellip;';
          if (url === '' || !url) {
            return '<span class="treegrid-cell-name">' + val + '</span>';
          }
          return '<a class="treegrid-cell-name" href="' + url + '">' + val + '</a>';
        },
        rowCls: function(level) {
          level = parseInt(level, 10) - 1;
          var result = 'treegrid-parent-' + level;

          return result;
        }
      },
      gridCfg: {
        pageSize: 20,
        // 显示更多
        showMorePage: true,
        tableClass: 'table table-striped table-hover',
        showGotoPage: false,
        cellTemplates: null,
        columnKeys: null,
        columnNames: null,
        columnWidths: null,
        rowTemplates: ['<tr data-id={{id}} data-pid="{{pid}}" class="treegrid-{{id}} treegrid-parent-{{pid}}">'],
        templates: {
          buttonBarTemplate: buttonBarTemplate,
          tableTemplate: '<table><thead></thead><tbody></tbody></table>'
        }
      },
      delegates: {
        'click :submit': 'onSearch',
        'click [data-role=load]': 'onLoad',
        'click .treegrid-expander': 'onClickNode'
      }
    },

    postData: function() {
      var self = this;
      var param = this.getParams();

      if (!self.option('cache')) {
        $.extend(param, {
          pageNo: self._currentPage,
          pageSize: self.option('gridCfg/pageSize')
        });
      }

      if (this.clickSearch || param.categoryId) {
        delete param.level;
      } else {
        param.level = 1;
      }

      return param;
    },

    onSearch: function(e) {
      e.preventDefault();
      var $name = this.$('[name=name]');
      var name = $name.val().trim();

      if (name === '') {
        this.clickSearch = false;
        this.refresh();
        return false;
      }
      this.$('[name=resultListType]').val(1);
      this.clickSearch = true;
      this.refresh();

      return false;
    },

    refresh: function() {
      this._currentPage = 1;
      this._compiledCellTemplates = null;
      this._tbody.empty();
      this.renderGrid();
    },

    showLoading: function() {
      if (this.option('showLoading')) {
        this.dialog = new Dialog({
          mask: true,
          content: '<i class="fa fa-spinner fa-spin"></i> 数据加载中，请等待...',
          data: {
            close: ''
          },
          effect: 'none'
        });
      }
    },

    removeLoading: function() {
      if (this.dialog) {
        this.dialog.destroy();
      }
    },

    onLoad: function() {
      this._currentPage++;
      this.loadData();
      return false;
    },

    registerHelper: function() {
      var helpers = this.option('gridHelpers');

      if (helpers) {
        var help;
        for (help in helpers) {
          Handlebars.registerHelper(help, helpers[help]);
        }
      }
    },

    /**
     * 打开子节点
     *
     * @event onOpenChild
     * @param  {[type]} e [description]
     */
    onClickNode: function(e) {
      var self = this;
      var url = this.option('url');
      var $target = $(e.target);
      var $row = $target.parents('tr');
      var expandedCls = this.option('expanderExpandedClass');
      var collapsedCls = this.option('expanderCollapsedClass');
      var id = $row.attr('data-id');
      var $nodes = self._tbody.find('.treegrid-parent-' + id);

      // 折叠当前节点
      function collapseNode(pid) {
        var $childs = self._tbody.find('.treegrid-parent-' + pid);
        // var $expander = $childs.find('.treegrid-expander');
        if ($childs.length) {
          $childs.each(function() {
            var $child = $(this);
            var id = $child.attr('data-id');
            $child.hide();
            collapseNode(id);
          });
        }
      }
      // 展开当前节点
      function expandNode(pid) {
        var $childs = self._tbody.find('.treegrid-parent-' + pid);

        if ($childs.length) {
          $childs.each(function() {
            var $child = $(this);
            var id = $child.attr('data-id');
            var $expander = $child.find('.treegrid-expander');

            $child.show();
            // 子节点有展开的继续展开
            if (!$expander.length || $expander.hasClass(expandedCls)) {
              expandNode(id);
            }
          });
        }
      }

      $target.data('rendered', $nodes.length > 0);

      this._currentRow = this._tbody.find('tr').eq($row.index());
      if ($target.hasClass(expandedCls)) {
        //$nodes.hide();
        collapseNode(id);
        $target.removeClass(expandedCls).addClass(collapsedCls);
      } else {
        $target.removeClass(collapsedCls).addClass(expandedCls);
        if ($target.data('rendered')) {
          expandNode(id);
        } else {
          io.get(url, {
            channelId: self.channelId,
            resultListType: 2,
            type: self.option('type'),
            pid: id
          }, function() {
            self._listData = this.data.listData;
            self._origListData = this.data.listData;
            // 重置已编译过的单元格模板
            self._compiledCellTemplates = null;
            self.loadChildData();
            $target.data('rendered', true);
          });
        }
      }

    },

    renderGrid: function() {
      var self = this;
      var gridCfg = this.option('gridCfg');
      if (!gridCfg) {
        return;
      }

      self.showLoading();
      var columnKeys = gridCfg.columnKeys;
      var cellTemplates = this._cellTemplates = gridCfg.cellTemplates || [];
      var treeKey = this.option('treeKey');
      var index = this.treeKeyIndex = columnKeys.indexOf(treeKey);
      var treeTpl = [];
      var expanderExpandedClass = this.option('expanderExpandedClass');
      var expanderCollapsedClass = this.option('expanderCollapsedClass');
      var expanderColumn = '{{{renderCategory url ' + treeKey + '}}}';
      treeTpl.push('{{#if isParent}}');
      if (this.clickSearch) {
        treeTpl.push('  {{treeIndent level}}<span class="treegrid-expander {{#if open}}' + expanderExpandedClass + '{{else}}' + expanderCollapsedClass + '{{/if}}"></span>' + expanderColumn);
      } else {
        treeTpl.push('  {{treeIndent level}}<span class="treegrid-expander ' + expanderCollapsedClass + '"></span>' + expanderColumn);
      }
      treeTpl.push('{{else}}');
      treeTpl.push('  {{{treeLeaf url ' + treeKey + ' level}}}');
      treeTpl.push('{{/if}}');
      treeTpl = treeTpl.join('');
      if (index > -1) {
        if (cellTemplates.length) {
          //cellTemplates.splice(index, 1, treeTpl)
          cellTemplates[index] = treeTpl;
        } else {
          var i = 0;
          var len = columnKeys.length;
          for (; i < len; i++) {
            cellTemplates[i] = (i == index ? treeTpl : null);
          }
        }
        gridCfg.cellTemplates = this._cellTemplates = cellTemplates;
      }

      io.get(this.option('url'), this.postData(), {
        'success': function() {
          var listData = this.data.listData;
          self._origListData = listData;
          self._listData = self.transformToTreeNodes(listData);

          if (!self._listData.length) {
            self._tbody.html('<tr><td colspan="' + self.option('gridCfg/cellTemplates').length + '">' + self.option('emptyTemplate') + '</td></tr>');
          } else {
            self._compileCellTemplates();
            self._totalCount = this.data.totalCount;
            self.loadData();
          }

          self.removeLoading();
        },
        'error': function(msg) {
          self.removeLoading();
          self.gridElement.empty();
          new Alert({
            content: msg
          });
        }
      });
    },

    /**
     * 创建表格
     *
     *
     * @return {[type]} [description]
     */
    _buildTable: function() {
      var self = this;
      var gridCfg = self.option('gridCfg');
      self._table = $(gridCfg.templates.tableTemplate).appendTo(self.gridElement);
      self._thead = self._table.find('thead');
      self._tbody = self._table.find('tbody');

      var columnNames = gridCfg.columnNames;
      if (!columnNames) {
        throw new Error('please define columnNames');
      }
      self._headRow = $('<tr>').appendTo(self._thead);
      columnNames.forEach(function(colName, index) {
        self._headRow.append('<th>' + colName + '</th>');
      });

      var columnWidths = gridCfg.columnWidths;
      if (columnWidths !== null) {
        columnWidths.forEach(function(width, index) {
          if (width !== null) {
            self._thead.find('th').eq(index).css('width', width);
          }
        });
      }

      self._table.addClass(gridCfg.tableClass);

      if (this.option('gridCfg/showMorePage')) {
        self._buttonBar = $(this.option('gridCfg/templates/buttonBarTemplate')).insertAfter(this._table);
      }

    },


    /**
     * 加载数据
     *
     * @method loadData
     */
    loadData: function(localPageData) {
      var self = this;
      var settings = self.option('gridCfg');
      var buttonBar = this._buttonBar;

      // 已加载到最后一页时，去掉“加载更多”
      if (buttonBar) {
        if (self._currentPage >= Math.ceil(self._totalCount / settings.pageSize)) {
          buttonBar.remove();
        } else {
          buttonBar.show();
        }
      }

      var start = (self._currentPage - 1) * settings.pageSize;
      var end = start + settings.pageSize;
      var rowTemplateIndex = 0;

      localPageData = localPageData || this._listData;
      localPageData = localPageData.slice(start, end);
      $.each(localPageData, function(rowIndex, rowData) {
        if (rowIndex < settings.pageSize) {
          var tr = $(settings.rowTemplates[rowTemplateIndex](rowData));
          self._gridData[rowData.id] = rowData;
          rowTemplateIndex++;
          if (rowTemplateIndex >= settings.rowTemplates.length) {
            rowTemplateIndex = 0;
          }
          $.each(settings.columnKeys, function(index, propertyName) {
            var td = $('<td>');
            //var td = '';

            if (self._compiledCellTemplates !== null && self._compiledCellTemplates[index] !== null && rowIndex < self._compiledCellTemplates[index].length && self._compiledCellTemplates[index][rowIndex] !== null) {
              td.html(self._compiledCellTemplates[index][rowIndex](localPageData));
              //td ＝ self._compiledCellTemplates[index][rowIndex](localPageData);
            } else {
              var value = rowData[propertyName];
              td.text(value);
            }
            tr.append(td);
            //trHtml += td;
          });
          self._tbody.append(tr);
          if (rowData.children) {
            self.loadData(rowData.children);
          }
        }
      });
    },

    /**
     * 预编译单元格模板
     *
     * @private
     * @method _compileCellTemplates
     */
    _compileCellTemplates: function() {
      var self = this;
      var cellTemplates = this._cellTemplates;
      var listData = this._origListData;
      var len = listData.length;

      if (self._compiledCellTemplates === null && cellTemplates !== null) {
        self._compiledCellTemplates = [];
        $.each(cellTemplates, function(innerIndex, cellTemplate) {
          if (cellTemplate !== null) {
            var rowIndex;
            var templates = [];
            var suppliedTemplateText = cellTemplate;
            for (rowIndex = 0; rowIndex < len; rowIndex++) {
              var templateText = suppliedTemplateText;
              templateText = '{{#with this.[' + rowIndex + ']}}' + templateText + '{{/with}}';
              templates.push(Handlebars.compile(templateText));
            }
            self._compiledCellTemplates.push(templates);
          } else {
            self._compiledCellTemplates.push(null);
          }
        });
      }
    },

    /**
     * 加载子类数据
     *
     * @method loadChildData
     */
    loadChildData: function() {
      var self = this;
      var settings = self.option('gridCfg');
      var childData = this._listData;
      var rowTemplateIndex = 0;
      var childRows = [];

      // 重置 _compiledCellTemplates
      self._compileCellTemplates();

      $.each(childData, function(rowIndex, rowData) {
        var tr = $(settings.rowTemplates[rowTemplateIndex](rowData));

        self._gridData[rowData.id] = rowData;
        rowTemplateIndex++;
        if (rowTemplateIndex >= settings.rowTemplates.length) {
          rowTemplateIndex = 0;
        }
        $.each(settings.columnKeys, function(index, propertyName) {
          var td = $('<td>');

          if (self._compiledCellTemplates !== null && self._compiledCellTemplates[index] !== null && rowIndex < self._compiledCellTemplates[index].length && self._compiledCellTemplates[index][rowIndex] !== null) {
            td.html(self._compiledCellTemplates[index][rowIndex](self._listData));
          } else {
            var value = rowData[propertyName];
            td.text(value);
          }
          tr.append(td);
        });
        childRows.push(tr);
      });
      self._currentRow.after(childRows);

    },

    /**
     * 可根据 数据的id 获取整条数据
     *
     * @param  {[type]} id
     * @return {[type]}    [description]
     */
    getGridData: function(id) {
      return id ? this._gridData[id] : this._gridData;
    },

    /**
     * 转成树节点格式
     *
     * @method transformToTreeNodes
     * @param  {[type]} sNodes [description]
     * @return {[type]}        [description]
     */
    transformToTreeNodes: function(sNodes) {
      var i, l, key = 'id',
        parentKey = 'pid',
        childKey = 'children';
      if (!key || key === '' || !sNodes) {
        return [];
      }
      if (!$.isArray(sNodes)) {
        return [sNodes];
      }
      var r = [];
      var tmpMap = [];
      for (i = 0, l = sNodes.length; i < l; i++) {
        tmpMap[sNodes[i][key]] = sNodes[i];
      }
      for (i = 0, l = sNodes.length; i < l; i++) {
        if (tmpMap[sNodes[i][parentKey]] && sNodes[i][key] != sNodes[i][parentKey]) {
          if (!tmpMap[sNodes[i][parentKey]][childKey]) {
            tmpMap[sNodes[i][parentKey]][childKey] = [];
          }
          tmpMap[sNodes[i][parentKey]][childKey].push(sNodes[i]);
        } else {
          r.push(sNodes[i]);
        }
      }
      return r;
    },

    setup: function() {
      this.initForm();
      this.gridElement = $(this.option('gridElement'));
      if (!this.gridElement.length) {
        this.gridElement = $('<div>').appendTo(this.element);
      }
      this.gridElement.addClass('grid-body');
      // 存储 频道id
      var $channelId = this.$('[name=channelId]');
      // 按id 存储所有行数据
      this._gridData = {};
      this.registerHelper();
      this.channelId = $channelId && $channelId.val();
      this._currentPage = 1;
      this._compiledCellTemplates = null;
      this._buildTable();
      this._complieRowTemplate();
      this.renderGrid();
    },
    _complieRowTemplate: function() {
      var rowTemplates = this.option('gridCfg/rowTemplates');
      $.each(rowTemplates, function(i, n) {
        rowTemplates[i] = Handlebars.compile(n);
      });
      this.option('gridCfg/rowTemplates', rowTemplates);
    },

    // 插入行
    appendRow: function($row, data) {
      // 新建一级分类插入表格首行
      var createParent = false;
      if (!data) {
        createParent = true;
        data = $row;
      }

      if (createParent) {
        $row = $(this.getRowContent(data.id, data.pid, this.getCellContent(data))).prependTo(this._tbody);
      } else {
        this.updateExpanderState($row, data);
      }
    },

    getRowContent: function(id, pid, content) {
      return substitute('<tr data-id="{id}" data-pid="{pid}" class="treegrid-{id} treegrid-parent-{pid}">{content}</tr>', {
        id: id,
        pid: pid,
        content: content
      });
    },

    // 更新树点击图标状态
    updateExpanderState: function($row, data) {
      var $expanderCell = $row.children().eq(this.treeKeyIndex);
      var $expander = $expanderCell.find('.treegrid-expander');
      var trHtml = this.getRowContent(data.id, data.pid, this.getCellContent(data));

      // 存在子分类
      if ($expander.length) {
        // 当前为展开状态
        if ($expander.hasClass(this.option('expanderExpandedClass'))) {
          $row.after(trHtml);
        } else {
          // 被展开过，又收起时
          if ($expander.data('rendered')) {
            $row.after(trHtml);
          }
          $expander.trigger('click');
        }
      } else {
        $expander = $('<span class="treegrid-expander ' + this.option('expanderExpandedClass') + '"></span>');
        $expander.insertBefore($row.children().eq(this.treeKeyIndex).find('.treegrid-cell-name'));
        $expander.data('rendered', true);
        $row.after(trHtml);
        // 去除一级父类前面的空白
        if ($row.attr('data-pid') === '0') {
          $row.find('.treegrid-indent').remove();
        }
        // 去除父类前面的折线
        $row.find('.treegrid-icon-bevel').remove();
      }
    },

    // 获取行单元格内容
    getCellContent: function(data) {
      var tds = '';
      var gridCfg = this.option('gridCfg');
      var columnKeys = gridCfg.columnKeys;

      gridCfg.cellTemplates.forEach(function(cellTemplate, index) {
        cellTemplate = cellTemplate || '{{' + columnKeys[index] + '}}';
        tds += '<td>' + cellTemplate + '</td>';
      });

      var template = Handlebars.compile(tds);
      var html = template(data);

      return html;
    },

    // 修改行
    editRow: function($row, data) {
      var iconCls = $row.find('.treegrid-expander').attr('class');
      $row.html(this.getCellContent(data));
      $row.find('.treegrid-expander').removeClass().addClass(iconCls);
    },
    // 删除行
    delRow: function($row) {
      var pid = $row.attr('data-pid');
      var $parent = this.$('.treegrid-' + pid);
      var $expanderWrap = $parent.find('td').eq(this.treeKeyIndex);
      var $brothers;

      $row.remove();
      // 当删除的节点是最后一个子节点时，要更新父节点状态
      $brothers = this.$('.treegrid-parent-' + $row.attr('data-pid'));
      if (!$brothers.length) {
        $expanderWrap.children().each(function() {
          if ($(this).hasClass('treegrid-expander')) {
            $(this).remove();
          }
        });
      }

    }
  });

  module.exports = TreeGrid;

  // function transfer(str) {
  //   return str.trim()
  //     .replace(/</g, '&lt;')
  //     .replace(/>/g, '&gt;')
  //     .replace(/"/g, '&quot;');
  // }
  // 一个简单的模板
  function substitute(str, obj) {
    var isString = Object.prototype.toString.call(str) === '[object String]';
    if (!isString) {
      return '';
    }

    // {}, new Object(), new Class()
    // Object.prototype.toString.call(node=document.getElementById("xx")) : ie678 == '[object Object]', other =='[object HTMLElement]'
    // 'isPrototypeOf' in node : ie678 === false , other === true
    if (!(Object.prototype.toString.call(obj) === '[object Object]' && 'isPrototypeOf' in obj)) {
      return str;
    }

    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/replace
    return str.replace(/\{([^{}]+)\}/g, function(match, key) {
      var value = obj[key];
      return (value !== undefined) ? '' + value : '';
    });
  }

