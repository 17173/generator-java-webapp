var common = require('./common');
var store = common.store;
var getFile = common.getFile;
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
        this.render.ftl(getFile('path'), store);
    }

};