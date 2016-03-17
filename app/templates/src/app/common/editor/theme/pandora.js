  'use strict';

  var Tabs = require('pandora-tabs');

  /*global tinymce:true */
  /*jshint maxdepth:4 */

  tinymce.ThemeManager.add('pandora', function(editor) {
    var self = this,
      settings = editor.settings,
      Factory = tinymce.ui.Factory,
      each = tinymce.each,
      DOM = tinymce.DOM;

    /**
     * Create Sidebars
     */
    function createSidebars(container) {
      var sidebar, statusbar, panes, panesHeight,tabs = [];

      if(settings.sidebarList === false){
        return;
      }

      settings.sidebarList = settings.sidebarList || ['image','video','gallery'];

      [{
        id: 'sidebar-image',
        name: '图片'
      }, {
        id: 'sidebar-video',
        name: '视频'
      }, {
        id: 'sidebar-gallery',
        name: '组图'
      }].forEach(function(item){
        if(settings.sidebarList.indexOf(item.id.replace('sidebar-','')) != -1){
          tabs.push(item);
        }
      });

      editor.sidebar = sidebar = new Tabs({
        classPrefix: 'mce-sidebar',
        container: container,
        data: {
          tabs: tabs
        },
        initialTab: -1
      });

      // 侦听状态栏 resize
      statusbar = editor.theme.panel.find('#statusbar')[0];

      statusbar.on('ResizeStart', function() {
        panes = sidebar.role('panes');
        panesHeight = panes.height();

        panes.css({
          flex: 'none',
          height: panesHeight
        });
      });

      statusbar.on('Resize', function(e) {
        panes.css({
          height: panesHeight + e.deltaY
        });
      });

      statusbar.on('ResizeEnd', function() {
        panes.css({
          flex: 1,
          height: 'auto'
        });
      });
    }

    /**
     * Creates the toolbars from config and returns a toolbar array.
     *
     * @return {Array} Array with toolbars.
     */
    function createToolbars() {
      var toolbars = [],
        toolbarArray = settings.toolbar || ['undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image'];

      function addToolbar(items) {
        var toolbarItems = [],
          buttonGroup;

        if (!items) {
          return;
        }

        each(items.split(/[ ,]/), function(item) {
          var itemName;

          function bindSelectorChanged() {
            var selection = editor.selection;

            if (itemName == 'bullist') {
              selection.selectorChanged('ul > li', function(state, args) {
                var nodeName, i = args.parents.length;

                while (i--) {
                  nodeName = args.parents[i].nodeName;
                  if (nodeName == 'OL' || nodeName == 'UL') {
                    break;
                  }
                }

                item.active(state && nodeName == 'UL');
              });
            }

            if (itemName == 'numlist') {
              selection.selectorChanged('ol > li', function(state, args) {
                var nodeName, i = args.parents.length;

                while (i--) {
                  nodeName = args.parents[i].nodeName;
                  if (nodeName == 'OL' || nodeName == 'UL') {
                    break;
                  }
                }

                item.active(state && nodeName == 'OL');
              });
            }

            if (item.settings.stateSelector) {
              selection.selectorChanged(item.settings.stateSelector, function(state) {
                item.active(state);
              }, true);
            }

            if (item.settings.disabledStateSelector) {
              selection.selectorChanged(item.settings.disabledStateSelector, function(state) {
                item.disabled(state);
              });
            }
          }

          if (item == '|') {
            buttonGroup = null;
          } else {
            if (Factory.has(item)) {
              item = {
                type: item
              };

              if (settings['toolbar_items_size']) {
                item.size = settings['toolbar_items_size'];
              }

              toolbarItems.push(item);
              buttonGroup = null;
            } else {
              if (!buttonGroup) {
                buttonGroup = {
                  type: 'buttongroup',
                  items: []
                };
                toolbarItems.push(buttonGroup);
              }

              if (editor.buttons[item]) {
                // TODO: Move control creation to some UI class
                itemName = item;
                item = editor.buttons[itemName];

                if (typeof(item) == 'function') {
                  item = item();
                }

                item.type = item.type || 'button';

                if (settings['toolbar_items_size']) {
                  item.size = settings['toolbar_items_size'];
                }

                item = Factory.create(item);
                buttonGroup.items.push(item);

                if (editor.initialized) {
                  bindSelectorChanged();
                } else {
                  editor.on('init', bindSelectorChanged);
                }
              }
            }
          }
        });

        toolbars.push({
          type: 'toolbar',
          layout: 'flow',
          items: toolbarItems
        });

        return true;
      }

      tinymce.each(toolbarArray, function(toolbar, i) {
        addToolbar(toolbar);
      });

      if (toolbars.length) {
        return {
          type: 'panel',
          layout: 'stack',
          classes: 'toolbar-grp',
          ariaRoot: true,
          ariaRemember: true,
          items: toolbars
        };
      }
    }

    /**
     * Resizes the editor to the specified width, height.
     */
    function resizeTo(width, height) {
      var containerElm, iframeElm, containerSize, iframeSize;

      function getSize(elm) {
        return {
          width: elm.clientWidth,
          height: elm.clientHeight
        };
      }

      containerElm = editor.getContainer();
      iframeElm = editor.getContentAreaContainer().firstChild;
      containerSize = getSize(containerElm);
      iframeSize = getSize(iframeElm);

      if (width !== null) {
        width = Math.max(settings['min_width'] || 100, width);
        width = Math.min(settings['max_width'] || 0xFFFF, width);

        DOM.css(containerElm, 'width', width + (containerSize.width - iframeSize.width));
        DOM.css(iframeElm, 'width', width);
      }

      height = Math.max(settings['min_height'] || 100, height);
      height = Math.min(settings['max_height'] || 0xFFFF, height);
      DOM.css(iframeElm, 'height', height);

      editor.fire('ResizeEditor');
    }

    function resizeBy(dw, dh) {
      var elm = editor.getContentAreaContainer();
      self.resizeTo(elm.clientWidth + dw, elm.clientHeight + dh);
    }

    /**
     * Renders the iframe editor UI.
     *
     * @param {Object} args Details about target element etc.
     * @return {Object} Name/value object with theme data.
     */
    function renderIframeUI(args) {
      var panel, sidebar, resizeHandleCtrl, startSize;

      if (args.skinUiCss) {
        tinymce.DOM.loadCSS(args.skinUiCss);
      }

      // Basic UI layout
      panel = self.panel = Factory.create({
        type: 'panel',
        role: 'application',
        classes: 'tinymce',
        html: function() {
          return '<div class="mce-mainbox">' + this._layout.renderHtml(this) + '</div>';
        },
        style: 'visibility: hidden',
        layout: 'stack',
        border: 1,
        items: [
          // settings.menubar === false ? null : {
          //     type: 'menubar',
          //     border: '0 0 1 0',
          //     items: createMenuButtons()
          //   },
          createToolbars(), {
            type: 'panel',
            name: 'iframe',
            layout: 'stack',
            classes: 'edit-area',
            html: '',
            border: '1 0 0 0'
          }
        ]
      });

      if (settings.resize !== false) {
        resizeHandleCtrl = {
          type: 'resizehandle',
          direction: settings.resize,

          onResizeStart: function() {
            var elm = editor.getContentAreaContainer().firstChild;

            startSize = {
              width: elm.clientWidth,
              height: elm.clientHeight
            };
          },

          onResize: function(e) {
            if (settings.resize == 'both') {
              resizeTo(startSize.width + e.deltaX, startSize.height + e.deltaY);
            } else {
              resizeTo(null, startSize.height + e.deltaY);
            }
          }
        };
      }

      // Add statusbar if needed
      if (settings.statusbar !== false) {
        panel.add({
          type: 'panel',
          name: 'statusbar',
          classes: 'statusbar',
          layout: 'flow',
          border: '1 0 0 0',
          ariaRoot: true,
          items: [{
              type: 'elementpath'
            },
            resizeHandleCtrl
          ]
        });
      }

      if (settings.readonly) {
        panel.find('*').disabled(true);
      }

      editor.fire('BeforeRenderUI');
      panel.renderBefore(args.targetNode).reflow();

      if (settings.width) {
        tinymce.DOM.setStyle(panel.getEl(), 'width', settings.width);
      }

      createSidebars(panel.getEl());

      // Remove the panel when the editor is removed
      editor.on('remove', function() {
        panel && panel.remove();
        panel = null;
        sidebar && sidebar.remove();
        sidebar = null;
      });

      return {
        iframeContainer: panel.find('#iframe')[0].getEl(),
        editorContainer: panel.getEl()
      };
    }

    /**
     * Renders the UI for the theme. This gets called by the editor.
     *
     * @param {Object} args Details about target element etc.
     * @return {Object} Theme UI data items.
     */
    self.renderUI = function(args) {

      args.skinUiCss = tinymce.baseURL + '/css/tinymce.min.css';

      // Load content.min.css or content.inline.min.css
      editor.contentCSS.push(tinymce.baseURL + '/css/tinymce-content.min.css');

      // Handle editor setProgressState change
      editor.on('ProgressState', function(e) {
        self.throbber || (self.throbber = new tinymce.ui.Throbber(self.panel.getEl('body')));

        if (e.state) {
          self.throbber.show(e.time);
        } else {
          self.throbber.hide();
        }
      });

      return renderIframeUI(args);
    };

    self.resizeTo = resizeTo;
    self.resizeBy = resizeBy;
  });

