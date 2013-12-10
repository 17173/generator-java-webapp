define(['jquery'],function($) {
    "use strict";

    var util = {};
    var doc = document;
    util.queryToJson = function (str, sep, eq) {
        var decode = decodeURIComponent,
            hasOwnProperty = Object.prototype.hasOwnProperty,
            suffix = function (str, suffix) {
                var ind = str.length - suffix.length;
                return ind >= 0 && str.indexOf(suffix, ind) == ind;
            };
        sep = sep || '&';
        eq = eq || '=';
        var ret = {},
            pairs = str.split(sep),
            pair, key, val,
            i = 0, len = pairs.length;

        for (; i < len; ++i) {
            pair = pairs[i].split(eq);
            key = decode(pair[0]);
            try {
                val = decode(pair[1] || '');
            } catch (e) {
                console.log(e + "decodeURIComponent error : " + pair[1], "error");
                val = pair[1] || '';
            }
            val = $.trim(val);
            if (suffix(key, "[]")) {
                key = key.substring(0, key.length - 2);
            }
            if (hasOwnProperty.call(ret, key)) {
                if ($.isArray(ret[key])) {
                    ret[key].push(val);
                } else {
                    ret[key] = [ret[key], val];
                }
            } else {
                ret[key] = val;
            }
        }
        return ret;
    };

    util.urlParams = function() {
        return util.queryToJson( window.location.search.replace(/^\?/, '') );
    };

    util.packForm = function(form, escape) {
        var a = $(form).serializeArray(),
            o = {};

        escape = (escape==undefined) ? true : false;

        $.each(a, function() {
            var value = this.value;

            this.value = value === 'null'?null:this.value;

            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(escape ? util.escape(this.value) : $.trim(this.value));
            } else {
                o[this.name] = (escape) ? util.escape(this.value) : $.trim(this.value);
            }
        });
        return o;
    };

    util.escape = function(str) {
        return $.trim(str)
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    };

    util.substring = function(str, len) {
        if (str) return str.substring(0, len);
        return str;
    };
    util.toQueryPair = function (key, value) {
        if (typeof value == 'undefined'){
            return key;
        }
        return key + '=' + encodeURIComponent(value === null ? '' : String(value));
    };
    util.toQueryString = function (obj) {
        var ret = [];
        for(var key in obj){
            key = encodeURIComponent(key);
            var values = obj[key];
            if(values && values.constructor == Array){// 数组
                var queryValues = [];
                for (var i = 0, len = values.length, value; i < len; i++) {
                    value = values[i];
                    queryValues.push(util.toQueryPair(key, value));
                }
                ret = ret.concat(queryValues);
            }else{ // 字符串
                ret.push(util.toQueryPair(key, values));
            }
        }
        return ret.join('&');
    };
    /**
     * 定义内联样式
     * @param  {String} str 样式
     */
    util.css = function(str) {
        var jsSelf = (function() {
            var files = doc.getElementsByTagName('link');
            return files[files.length - 1];
        })();
        var css = doc.getElementById('do-inline-css');
        if (!css) {
            css = doc.createElement('style');
            css.type = 'text/css';
            css.id = 'do-inline-css';
            jsSelf.parentNode.insertAfter(css, jsSelf);
        }

        if (css.styleSheet) {
            css.styleSheet.cssText = css.styleSheet.cssText + str;
        } else {
            css.appendChild(doc.createTextNode(str));
        }
    };

    util.loadCSS = function(url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    };

    util.processor = function(json, callback) {

        var msg,
            success,
            error,
            input;

        //全局异常处理(login|error)
        /*if ( json.result == 'login' ) {
            //登录页跳转
            window.location.href = util.$cfg('page_login');
        }*/
        if ( json.result == 'error' ) {
            //异常提示
            console.error(json.messages);
            return;
        }

        /**
         * 业务相关回调,参数中包含业务的成功失败消息
         * 1. success(message)|failure(message)
         *
         * 表单验证
         * 2. input(fieldErrors)
         */
        if ( $.inArray(json.result, ['success', 'failure']) != -1 ) {

            msg = json.messages.shift() || json.messages;

            success = callback['success'] || callback,
                error = callback['error'] ||
                    function(msg){
                        console.warn(msg);
                        //$.error(msg).modal();
                    };

            (json.result == 'success')
                ? success.call(json, msg)
                : error.call(json, msg);

        } else if ( json.result == 'input' ) {

            if ( !$.isEmptyObject(json['fieldErrors']) ) {

                $.each(json['fieldErrors'], function(field, v){

                    msg = (v.shift && v.shift()) || v;

                    input = callback['input'];

                    input && input[field] && input[field].call(json, msg);
                });

            } else {

                msg = json.messages.shift() || json.messages;

                callback['input']
                    ? (callback['input'].call(json, msg))
                    //: ($.message(msg).modal());
                    : console.log(msg);
            }
        }
    };

    util.post = function(url, data, callback) {
        if ( callback == undefined ) {
            callback = data;
            data = {};
        }
        $.ajax({
            url: url,
            dataType: 'json',
            traditional: true,
            type: 'POST',
            data: data,
            success: function(d) {
                //callback(d);
                d && util.processor(d, callback);
            },
            error: function() {
                console.warn('server error: ' + url);
            }
        });
    };

    util.substitute = function(str, obj) {
        if (!(Object.prototype.toString.call(str) === '[object String]')) {
            return '';
        }

        // {}, new Object(), new Class()
        // Object.prototype.toString.call(node=document.getElementById("xx")) : ie678 == '[object Object]', other =='[object HTMLElement]'
        // 'isPrototypeOf' in node : ie678 === false , other === true
        if(!(Object.prototype.toString.call(obj) === '[object Object]' && 'isPrototypeOf' in obj)) {
            return str;
        }

        // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/replace
        return str.replace(/\{([^{}]+)\}/g, function(match, key) {
            var value = obj[key];
            return ( value !== undefined) ? ''+value :'';
        });
    };
    // http://docs.jquery.com/Plugins/Validation/Methods/email
    util.email = function(value) {
        // contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
        return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
    };

    $.extend(util, {

    })
    return util;
});