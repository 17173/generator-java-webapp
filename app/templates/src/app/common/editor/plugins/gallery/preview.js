define(function(require, exports, module) {

    /**
     * 组件可视化插入
     */

    'use strict';

    var io = require('../../../io'),
        template = require('./preview.handlebars');

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

    module.exports = function(dom, galleryId) {
        var html = cacheHTML[galleryId];

        if (html) {
            insertHtml(dom, html);
            return;
        }

        io.get('componentPreview', {
            id: galleryId
        }, {
            success: function() {
                var data = this.data.componentData.data;
                if(data.children && data.children.length){
                  data.first = data.children[0].imgUrl;
                }
                html = template(data);
                cacheHTML[galleryId] = html;
                insertHtml(dom, html);
            },
            error: function() {
                insertHtml(dom, '组图"'+ dom.getAttribute('data-mce-p-title') +'"已删除!');
                dom.setAttribute('data-delete','');
            }
        });
    };

});
