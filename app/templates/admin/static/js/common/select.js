define(['jquery','common/class','common/util','selectize'], function ($, Class, util) {
    "use strict";

    var Select = Class.create({
        initialize: function(options) {
            this.options = $.extend({}, defaults, options);
            this._init();
        },
        _init: function() {
            var self = this;
            $('[data-role=selectize]').each(function() {
                var $self = $(this);
                var url = $self.data('ajaxUrl');
                var createKey = $self.data('createKey');
                self.parseData($self, url, createKey);
                $self.selectize(self.options);
                self.options = {};
            })
        },
        parseData: function($sel, url, createKey) {
            var self = this;
            if (url) {
                this.options.create = false;
                this.options.load = this.load;
                this.options.onInitialize = function(t) {
                    console.log(t)
                }
            } else if (createKey) {
                this.options.create = false;
                this.options.options = CUI.optionsData[createKey];

            } else if ($sel.children().length) {
                this.options.create = true;
            }
        },
        load: function(query, callback) {
            var url = this.options.url;
            util.post(CUI.getUrl(url),{fdName:encodeURIComponent(query)}, {
                success: function() {
                    var data = this.data;
                    console.log(data)
                    callback(data.slice(0, 10))
                },
                error: function() {
                    callback();
                }
            })
        }
    });

    var defaults = {
        valueField: 'fdId',
        labelField: 'fdName',
        searchField: 'fdName'
    };

    return Select;
});