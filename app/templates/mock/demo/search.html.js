var permission = require('./../permission');

module.exports = function(req, res, next) {
  res.render('template/ftl/admin/demo/search/index.ftl', { menuList: permission.menuList, menuListJson: permission.menuListJson });
};
