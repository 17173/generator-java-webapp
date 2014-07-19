module.exports = {
  getFile: function(s) {
    return 'WEB-INF/template/ftl/' + s + '/index';
  },
  getJSON: function (s) {
    if (!/\.json$/.test(s)) {
      s = s + '.json';
    }
    return readJsonFileSync('mock/json/' + s);
  },

  getPageData: function(listData, pageNo, pageSize) {
    pageNo = parseInt(pageNo, 10);
    pageSize = parseInt(pageSize, 10);
    var start = (pageNo - 1) * pageSize;
    var end = (pageNo - 1) * pageSize + pageSize;

    return {
      listData: listData.slice(start, end),
      pageSize: pageSize,
      pageNo: pageNo
    };
  },
  store: {
    ctx: 'http://localhost:3001'
  }
}