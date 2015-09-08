define("pandora/importstyle/1.0.0/importstyle-debug", [], function(require, exports, module) {
    "use strict";
    /**
   * The Sea.js plugin for embedding style text in JavaScript code
   * Copy from git://github.com/popomore/import-style.git
   * @class importStyle
   * @module importStyle
   * @param  {string} cssText 样式内容
   * @param  {string} [id]    样式 ID，用于避免重复加载
   */
    var RE_NON_WORD = /\W/g;
    var doc = document, head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    var styleNode;
    module.exports = function(cssText, id) {
        var element;
        if (id) {
            // Convert id to valid string
            id = id.replace(RE_NON_WORD, "-");
            // Don't add multiple times
            if (doc.getElementById(id)) {
                return;
            }
        }
        // Don't share styleNode when id is spectied
        if (!styleNode || id) {
            element = doc.createElement("style");
            id && (element.id = id);
            // Adds to DOM first to avoid the css hack invalid
            head.appendChild(element);
        } else {
            element = styleNode;
        }
        // IE
        if (element.styleSheet) {
            // http://support.microsoft.com/kb/262161
            if (doc.getElementsByTagName("style").length > 31) {
                throw new Error("Exceed the maximal count of style tags in IE");
            }
            element.styleSheet.cssText += cssText;
        } else {
            element.appendChild(doc.createTextNode(cssText));
        }
        if (!id) {
            styleNode = element;
        }
    };
});
