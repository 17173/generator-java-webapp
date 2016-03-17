    /**
     * Html可视化插入
     */

    'use strict';

    var io = require('../../../io');

    var cacheHTML = {};

    function insertHtml(dom, html) {
        var shadow;
        if(dom.createShadowRoot){
          shadow = dom.createShadowRoot();
        }else{
          shadow = dom.webkitCreateShadowRoot();
        }
        shadow.innerHTML = html;
    }

    module.exports = function(dom, htmlId, reload) {
        var html = cacheHTML[htmlId];

        if (!reload && html) {
            insertHtml(dom, html);
            return;
        }

        io.get('componentPreview', {
            id: htmlId
        }, {
            success: function() {
                html = this.data.componentData.data;
                cacheHTML[htmlId] = html;
                insertHtml(dom, html);
            },
            error: function() {
                insertHtml(dom, 'HTML组件无权操作或已删除');
                dom.setAttribute('data-delete','');
            }
        });
    };

