/**
 * 获取后台 ftl 文件路径
 *
 * @param s
 * @returns {string}
 */
var adminUrl = function(s) {
    return 'WEB-INF/template/ftl/admin/' + s;
};
module.exports = {
    "get /url": function(req, res) {
        this.render.ftl(adminUrl('path'), {});
    },
    "post /url": function(req, res) {
        this.render.ftl(adminUrl('path'), {});
    }

};