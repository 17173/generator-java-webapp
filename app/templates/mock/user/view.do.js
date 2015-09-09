module.exports = function(req, res, next) {
  var data = {
    result: 'success',
    messages: [],
    data: {
      id: 2,
      code: 'cy1232',
      name: '随便的名字了'
    }
  };
  data = JSON.stringify(data);
  res.end(data);
};
