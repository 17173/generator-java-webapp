/**
 * 获取 ftl 文件路径
 *
 * @param s
 * @returns {string}
 */
var getFile = function(s) {
    return 'WEB-INF/template/ftl/' + s + '/index';
};
module.exports = {
    // mock 请求
    "post /url": function(req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": {

            }
        });
    },
    // mock freeMarker 文件
    "get /url": function(req, res) {
        this.render.ftl(getFile('path'), {});
    }

};