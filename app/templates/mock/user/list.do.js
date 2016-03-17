var Mock = require('mockjs');

module.exports = function(req, res, next) {
  var data = {
    result: 'success',
    messages: [],
    data: {
      pageNo:1,
      totalCount: 3,
      'listData|5-15': [{
        id: '@id',
        code: 'CY@integer(1000, 10000)',
        name: '@cname'
      }]
    }
  };
  data = JSON.stringify(Mock.mock(data));
  res.end(data);
};
