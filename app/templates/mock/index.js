var common = require('./common');
var store = common.store;
var getFile = common.getFile;
module.exports = {
    "get /": function() {
        this.render.ftl(getFile('hello'), store);
    },
    "get /hello": function() {
        this.render.ftl(getFile('hello'), store);
    }

};