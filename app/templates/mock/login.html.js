var permission = require('./permission');

module.exports = function(req, res, next) {
  res.render('template/ftl/admin/login/index.ftl', { menuList: permission.menuList, menuListJson: permission.menuListJson });
};
