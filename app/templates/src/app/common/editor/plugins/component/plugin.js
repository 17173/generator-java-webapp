  'use strict';

  var $ = require('jquery'),
   Selector = require('./selector'),
    EditDialog = require('./editdialog'),
    preview = require('./preview');

  /*global tinymce:true */

  tinymce.PluginManager.add('component', function(editor) {

    var TR_ATTR_NAME = 'data-mce-p-cms-component-id';

    function insertContent(data) {
       editor.insertContent('<div' +
         ' cms-data-type="html"' +
         ' cms-component-id="' + data.id + '"' +
         ' cms-component-path="' + data.componentPath + '"' +
         // ' cms-css-id="' + data.templateCss.id + '"' +
         // ' class="component component-html"' +
         ' title="' + data.componentName + '"></div>');
    }

    function showDialog() {
      var imgElm = editor.selection.getNode(),
        selectedIds = [];

      if (imgElm.nodeName !== 'INPUT' ||
          imgElm.getAttribute('data-mce-component') !== 'html') {
        imgElm = null;
      }

      if (imgElm) {
        selectedIds = [imgElm.dataset.mcePCmsComponentId];
      }

      new Selector({
        selectedIds: selectedIds
      }).submit(function() {
        this.list.getSelected().forEach(function(data) {
          insertContent(data);
        });
      });
    }

    function showEditDialog() {
      var id,
          imgElm = editor.selection.getNode();

      if (imgElm.nodeName !== 'INPUT' ||
          imgElm.getAttribute('data-mce-component') !== 'html') {
        return;
      }
      id = imgElm.dataset.mcePCmsComponentId;
      new EditDialog({
        id: id,
        events: {
          done: function(e, data) {
            // 另存，回填 ID
            if (data.id) {
              imgElm.dataset.mcePCmsComponentId = data.id;
              imgElm.dataset.mcePCmsComponentPath = data.componentPath;
              imgElm.dataset.mcePTitle = data.componentName;
            }
            doReplace(data.id || id  , true);
          }
        }
      });
    }

    function postRender() {
      /*jshint validthis:true*/
      toggleMenuItem(this, '[data-mce-component="html"]:not([data-delete])');
    }

    function toggleMenuItem(ctrl, selector) {

      function bindSelectionListener() {

        function toggleMenuText(matched) {
          matched ? ctrl.show() : ctrl.hide();
        }

        toggleMenuText(editor.dom.getParent(editor.selection.getStart(), selector));

        editor.selection.selectorChanged(selector, toggleMenuText);
      }

      if (editor.initialized) {
        bindSelectionListener();
      } else {
        editor.on('init', bindSelectionListener);
      }
    }

    editor.on('ResolveName', function(e) {
      var name;

      if ((name = e.target.dataset.mceComponent)) {
        e.name = name;
      }
    });

    // SSI to HTML
    // editor.on('BeforeSetContent', function (e) {
    // });

    // // HTML to SSI
    // editor.on('GetContent', function (e) {
    // });

    function fireInsertHtml(id,queryId){
      setTimeout(function(){
        editor.fire('insertHtml', {
          id : id,
          queryId : queryId
        });
      },20);
    }

    function doReplace(id, reload){
      $('['+ TR_ATTR_NAME +'=' + id +']', editor.getDoc()).each(function(){
        preview(this, id, reload);
      });
    }

    editor.on('insertHtml',function(e){
      doReplace(e.id);
    });

    editor.on('preInit', function() {

      // Converts component tag into component images
      editor.parser.addAttributeFilter('cms-data-type', function(nodes, name) {

        var i = nodes.length,
          node, parentNode, placeHolder,
          attribs, ai, attrName, attrValue;

        while (i--) {
          node = nodes[i];

          if (node.attr(name) !== 'html') {
            continue;
          }

          parentNode = new tinymce.html.Node('p', 1);

          placeHolder = new tinymce.html.Node('input', 1);
          placeHolder.shortEnded = true;

          attribs = node.attributes;
          ai = attribs.length;
          while (ai--) {
            attrName = attribs[ai].name;
            attrValue = attribs[ai].value;

            placeHolder.attr('data-mce-p-' + attrName, attrValue);
          }

          placeHolder.attr({
            'data-mce-component': 'html',
            'data-mce-resize': 'false',
            src: tinymce.Env.transparentSrc,
            style: node.attr('style'),
            title: node.attr('title')
          });

          parentNode.append(placeHolder);

          node.replace(parentNode);

          fireInsertHtml(placeHolder.attr(TR_ATTR_NAME));
        }

      });

      // Replaces component images with real elements component
      editor.serializer.addAttributeFilter('data-mce-component', function(nodes, name) {
        var i = nodes.length,
          node, realElm, parentNode,
          ai, attribs, attrName;

        while (i--) {
          node = nodes[i];

          if (node.attr(name) !== 'html') {
            continue;
          }

          parentNode = node.parent;

          realElm = new tinymce.html.Node('div', 1);

          realElm.attr({
            style: node.attr('style'),
            title: node.attr('title')
          });

          // Unprefix all component attributes
          attribs = node.attributes;
          ai = attribs.length;
          while (ai--) {
            attrName = attribs[ai].name;

            if (attrName.indexOf('data-mce-p-') === 0) {
              realElm.attr(attrName.substr(11), attribs[ai].value);
            }
          }

          if (parentNode.name !== 'body') {
            parentNode.parent.insert(realElm, parentNode, true);
            node.remove();
          } else {
            node.replace(realElm);
          }

          // 清除空白的 P 节点
          if (!parentNode.firstChild) {
            parentNode.remove();
          }
        }
      });
    });

    // 确保右键选中
    editor.on('mouseup', function(e) {
      if (e.target.nodeName === 'INPUT') {
        if (editor.fire('ResolveName', {
          target: e.target
        }).name === 'html') {
          editor.selection.select(e.target);
        }
      }
    });

    editor.addButton('component', {
      icon: 'component',
      tooltip: 'Component',
      onclick: showDialog,
      stateSelector: '[data-mce-component=html]'
    });

    if(window.AUTH.isAuth('componentInstanceListEdit')){
        editor.addMenuItem('component', {
          icon: 'component',
          text: 'Edit component',
          onclick: showEditDialog,
          onPostRender: postRender,
          context: 'insert',
          prependToContext: true
        });
    }
  });

