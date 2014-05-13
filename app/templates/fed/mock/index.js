var common = require('./common');
var store = common.store;
var getFile = common.getFile;
module.exports = {
    "get /": function(req, res) {
        res.redirect('/hello');
    },
    "get /:module": function(req, res) {
        var module = req.param('module');
        this.render.ftl(getFile(module), store);
    }

};