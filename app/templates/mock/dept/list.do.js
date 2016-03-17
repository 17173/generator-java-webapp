var Mock = require('mockjs');

module.exports = function(req, res, next) {
  var data = {
    result: 'success',
    messages: [],
    data: {
      pageNo:1,
      totalCount: 3,
      'listData|3-5': [{
        id: '@id',
        name: '@name'
      }]
    }
  };
  data = JSON.stringify(Mock.mock(data));
  res.end(data);
};
