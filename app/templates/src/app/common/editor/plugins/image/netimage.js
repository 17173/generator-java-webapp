define(function(require, exports, module) {
    /**
     * 处理网络图片
     */

    'use strict';

    var io = require('../../../io');

    var regexp = /<img\s+[^>]*?src="(.+?)"[^>]*>/gim;
    var regexpAttr = /(\w+)="([^"]+)"/gi;
    //var regexpMotu = /\/i[123]\.17173cdn\.com.*$/i;  //上线后使用ix.17173cdn.com的域名
    var regexpMotu = /\/i[123]\.(17173cdn|cdn\.test\.17173)\.com.*$/i; //测试时使用ix.cdn.test.17173.com的域名

    var imageCache = {};
    var currentEditor;

    //执行转换
    function doConvert(content) {
        var match,
            path,
            imageInfo,
            moTuList = [], //已经是图库中的图片，不替换但要加入素村区。
            newImages = [],
            postData = []; //提交到后台的数据，不能有多余的属性。


        if(!/<img\s+[^>]*>/.test(content)){
          return;
        }

        while ((match = regexp.exec(content))) {
            path = match[1];
            if (imageCache[path]) { //如果素材区删除了，然后重新复制，就直接使用缓存数据
                appendToList([imageCache[path]]);
            } else if (regexpMotu.test(path)) {
                imageInfo = getAttr(match[0]);
                imageInfo.src = imageInfo.originalSrc = path;
                imageCache[path] = imageInfo;
                moTuList.push(imageInfo);
            } else {
                imageInfo = getAttr(match[0]);
                imageInfo.src = path;
                newImages.push(imageInfo);
                postData.push({
                    remark: imageInfo.remark,
                    src: imageInfo.src,
                    tags: ''
                });
                imageCache[path] = imageInfo;
            }
        }
        newImages.reverse();
        postData.reverse();
        moTuList.reverse(); //反置是为了素材区里的图片顺序和文章中出现的顺序保持一致。
        if (moTuList.length) {
            appendToList(moTuList);
        }
        if (postData.length) {
            turnToLocal(postData, function() {
                var localImages = processData(this.data, newImages);
                appendToList(localImages);
                replaceImage();
            });
        } else {
            replaceImage();
        }
    }

    //解析图片属性
    function getAttr(nodeStr) {
        var matchAttr,
            attr,
            imageInfo = {};
        while ((matchAttr = regexpAttr.exec(nodeStr))) {
            attr = matchAttr[1];
            (attr == 'width' || attr == 'height') && (imageInfo[attr] = matchAttr[2]);
            (attr == 'alt') && (imageInfo.remark = matchAttr[2]);
        }
        imageInfo.remark = imageInfo.alt = imageInfo.remark || '';
        return imageInfo;
    }

    //转到本地图库
    function turnToLocal(newImages, callBack) {
        io.post('uploadWebImage', {
            images: JSON.stringify(newImages)
        }, callBack);
    }

    //加到素材区
    function appendToList(images) {
        var imagePaneList;
        currentEditor.sidebar.slide('#sidebar-image');
        imagePaneList = currentEditor.sidebar.imagePaneList;

        images.forEach(function(item) {
            imagePaneList.append(item);
        });

        imagePaneList.update(currentEditor.getContent());
    }

    //处理显示数据
    function processData(data, images) {
        var oldObj;
        data.forEach(function(item, i) {
            oldObj = images[i]; //后端会保正返回顺序。
            oldObj._oldSrc = oldObj.src;
            oldObj.src = oldObj.originalSrc = item.remotePath;
            oldObj.alt = oldObj.remark;
            delete oldObj.remark;
            imageCache[item.remotePath] = oldObj; //新地址也存入缓存
        });
        return images;
    }

    //替换成图库地址
    function replaceImage() {
        var content = currentEditor.getContent();
        var newContent = content.replace(regexp, function() {
            var match = arguments,
                img = match[0],
                src = match[1],
                local = imageCache[src];
            if (src && local && !regexpMotu.test(src)) {
                return img.replace(src, local.src);
            } else {
                return match[0];
            }
        });
        currentEditor.setContent(newContent);
        currentEditor.fire('change');
        currentEditor.selection.select(currentEditor.getBody(), true);
        currentEditor.selection.collapse(false);
    }

    function netImage(editor) {

        //执行粘贴操作时才转换图片
        currentEditor = editor;
        currentEditor.on('paste', function(event) {

            setTimeout(function() {
                var content = currentEditor.getContent();
                doConvert(content);
            }, 20);

            //无法获取到粘贴的完整内容,没有html标签，只有纯文本。
            //var pasteContent = event.clipboardData.getData('text');
            //console.log(pasteContent);
        });
    }

    function isMotu(src) {
        return regexpMotu.test(src);
    }

    module.exports = {
        netImage: netImage,
        turnToLocal: turnToLocal,
        isMotu: isMotu
    };

});
