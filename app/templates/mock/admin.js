var adminUrl = function(s) {
    return 'WEB-INF/template/ftl/admin/' + s;
}
var common = require('./common');
var store = common.store;
module.exports = {
    "get /": function() {
        this.render.ftl(adminUrl('hello'), store);
    },
    "get /admin/example/search": function(req, res) {
        this.render.ftl(adminUrl('example/search'), store);
    },
    "get /admin/example/form": function(req, res) {
        this.render.ftl("example/form", store);
    },
    "get /admin/example/detail": function(req, res) {
        this.render.ftl("example/detail", store);
    }

};