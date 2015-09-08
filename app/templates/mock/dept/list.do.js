module.exports = function(req, res, next) {
  var data = {
    result: 'success',
    messages: [],
    data: {
      pageNo:1,
      totalCount: 3,
      listData: [{
        id: '1',
        name: 'UE'
      }, {
        id: '2',
        name: 'UI'
      }, {
        id: '3',
        name: 'JAVA'
      }]
    }
  };
  data = JSON.stringify(data);
  res.end(data);
};
