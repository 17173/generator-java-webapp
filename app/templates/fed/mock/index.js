var common = require('./common');
var store = common.store;
var getFile = common.getFile;
module.exports = {
  "get /": function(req, res) {
    this.render.ftl(getFile(''), store);
  },
  "get /:module": function(req, res) {
    var module = req.param('module');
    this.render.ftl(getFile(module), store);
  },
  // mock freeMarker 文件
  "get /admin/:module.html": function(req, res) {
    var module = req.param('module');
    this.render.ftl(getFile(module), store);
  },
  // mock freeMarker 文件
  "get /admin/:mod1/:mod2.html": function(req, res) {
    var mod1 = req.param('mod1');
    var mod2 = req.param('mod2');
    this.render.ftl(getFile([mod1, mod2].join('/')), store);
  },
  "get /admin/:mod1/:mod2/:mod3.html": function(req, res) {
    var mod1 = req.param('mod1');
    var mod2 = req.param('mod2');
    var mod3 = req.param('mod3');
    this.render.ftl(getFile([mod1,mod2,mod3].join('/')), store);
  },
  "get /test/data": function(req, res) {
    res.send({
      result: 'success',
      messages: [],
      data: {
        text:"测试 /_site 对 mock 数据的访问"
      }
    })
  }

};