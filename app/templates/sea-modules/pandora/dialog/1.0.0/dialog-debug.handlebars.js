define("pandora/dialog/1.0.0/dialog-debug.handlebars", [ "gallery/handlebars/1.3.0/handlebars-runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.3.0/handlebars-runtime-debug");
    module.exports = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, helper, functionType = "function", self = this;
        function program1(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n<a class="dialog-close" href="javascript:" data-role="close">';
            if (helper = helpers.close) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.close;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "</a>\r\n";
            return buffer;
        }
        function program3(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n<div class="dialog-head" data-role="head">\r\n  <h3 class="dialog-title" data-role="title">';
            if (helper = helpers.title) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.title;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "</h3>\r\n</div>\r\n";
            return buffer;
        }
        function program5(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n<div class="dialog-foot" data-role="foot">\r\n  <a href="javascript:;" class="dialog-submit" data-role="submit">';
            if (helper = helpers.submit) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.submit;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "</a>\r\n  ";
            stack1 = helpers["if"].call(depth0, depth0 && depth0.cancel, {
                hash: {},
                inverse: self.noop,
                fn: self.program(6, program6, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\r\n</div>\r\n";
            return buffer;
        }
        function program6(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n  <a href="javascript:;" class="dialog-cancel" data-role="cancel">';
            if (helper = helpers.cancel) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.cancel;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "</a>\r\n  ";
            return buffer;
        }
        stack1 = helpers["if"].call(depth0, depth0 && depth0.close, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n";
        stack1 = helpers["if"].call(depth0, depth0 && depth0.title, {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '\r\n<div class="dialog-body" data-role="body">\r\n  <div class="dialog-content" data-role="content">';
        if (helper = helpers.content) {
            stack1 = helper.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            helper = depth0 && depth0.content;
            stack1 = typeof helper === functionType ? helper.call(depth0, {
                hash: {},
                data: data
            }) : helper;
        }
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "</div>\r\n</div>\r\n";
        stack1 = helpers["if"].call(depth0, depth0 && depth0.submit, {
            hash: {},
            inverse: self.noop,
            fn: self.program(5, program5, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n";
        return buffer;
    });
});
