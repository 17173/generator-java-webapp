/**
 * 获取后台 ftl 文件路径
 *
 * @param s
 * @returns {string}
 */
var getFile = function(s) {
    return 'WEB-INF/template/ftl/' + s + '/index';
};
module.exports = {
    "get /url": function(req, res) {
        this.render.ftl(getFile('path'), {});
    },
    "post /url": function(req, res) {
        this.render.ftl(getFile('path'), {});
    }

};