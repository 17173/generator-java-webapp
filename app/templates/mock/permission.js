var menuList = [{
  "id": 2,
  "name": "演示页",
  "type": 1,
  "url": "",
  "parentId": "1",
  "permission": "admin:user-menu",
  "parentPermission": null,
  "avaliable": 1
}, {
  "id": 3,
  "name": "系统设置",
  "type": 1,
  "url": "",
  "parentId": "1",
  "permission": "admin:setting-menu",
  "parentPermission": null,
  "avaliable": 1
}];
var menuListJson = JSON.stringify(menuList);

module.exports = {
  menuList: menuList,
  menuListJson: menuListJson
};
