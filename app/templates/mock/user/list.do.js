module.exports = function(req, res, next) {
  var data = {
    result: 'success',
    messages: [],
    data: {
      pageNo:1,
      totalCount: 3,
      listData: [{
        id: '1',
        code: 'cy1111',
        name: '张三22223333'
      }, {
        id: '2',
        code: 'cy1112',
        name: '张三1222'
      }, {
        id: '3',
        code: 'cy1113',
        name: '张三2aaadddfffff'
      }]
    }
  };
  data = JSON.stringify(data);
  res.end(data);
};
