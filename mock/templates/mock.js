var Mock = require('mockjs');

module.exports = function(req, res, next) {
  var data = {
    result: 'success',
    messages: [],
    data: {

    }
  };
  data = JSON.stringify(Mock.mock(data));
  res.end(data);
};
