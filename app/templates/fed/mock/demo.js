var common = require('./common');
var store = common.store;
var getFile = common.getDemoFile;

module.exports = {

  'get /demo': function (req, res) {
    this.render.ftl(getFile(''), store);
  },

  'get /demo/:demo': function (req, res) {
    this.render.ftl(getFile(req.param('demo')), store);
  },

  'post /demo/:demo': function (req, res) {
    if (!req.files) {
      res.type('application/json');
      res.send(req.body);
    } else {
      res.send(req.files);
    }
  }

};
