module.exports = function(req, res, next) {
  var data = {
    result: 'success',
    messages: [],
    data: ['tag1','tag2','tag3']
  };
  data = JSON.stringify(data);
  res.end(data);
};
