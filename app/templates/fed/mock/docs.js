var common = require('./common');
var store = common.store;
var getFile = common.getDocsFile;

module.exports = {

  'get /docs': function (req, res) {
    this.render.ftl(getFile('index'), store);
  }

};
