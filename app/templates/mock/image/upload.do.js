module.exports = function(req, res, next) {
  var data = {
    "result": "success",
    "messages": [],
    "fieldErrors": {},
    "errors": [],
    "data": {
      "capacity": 548.12,
      "cdnDomain": "i1.cdn.test.17173.com",
      "cdnPath": "/2fhnvk/YWxqaGBf/cms3/vnmmsqbiBypfulb.jpg",
      "createTime": 1404201783649,
      "creator": "cms3",
      "extension": {},
      "fileType": "jpg",
      "height": 768,
      "id": "vnmmsqbiBypfulb",
      "md5": "8969288f4245120e7c3870287cce0ff3",
      "name": "Lighthouse.jpg",
      "originId": null,
      "remark": null,
      "remotePath": "http://i1.cdn.test.17173.com/dsh3sx/YWxqaGBf/2/20140627165926/Tulips.jpg",
      "tags": null,
      "version": null,
      "versionType": 0,
      "width": 1024
    }
  };
  data = JSON.stringify(data);
  res.end(data);
};
