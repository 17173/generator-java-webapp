module.exports = function(req, res, next) {
  var data = {
    result: 'success',
    messages: [],
    data: {

    }
  };
  data = JSON.stringify(data);
  res.end(data);
};
