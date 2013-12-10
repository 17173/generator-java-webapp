var adminUrl = function(s) {
    return 'WEB-INF/template/ftl/admin/' + s;
}
module.exports = {
    "get /admin/example/search": function(req, res) {
        this.render.ftl(adminUrl('example/search'), {});
    },
    "get /admin/example/form": function(req, res) {
        this.render.ftl("example/form", {});
    },
    "get /admin/example/detail": function(req, res) {
        this.render.ftl("example/detail", {});
    }

};