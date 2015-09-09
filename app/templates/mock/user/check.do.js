module.exports = function(req, res, next) {
  var data = {
    result: 'success',
    messages: [],
    data:true
  };
  data = JSON.stringify(data);
  res.end(data);
};
