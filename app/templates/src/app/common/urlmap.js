/**
 * URL映射
 *
 * @module common/urlmap
 * @type {JSON}
 */
define(function(require, exports, module) {
  'use strict';

  /**
   * 请求接口地址
   */

  module.exports = {

    login: 'system/login.do',
    unLogin: 'system/loginout.do',

    userList: 'user/list.do',
    userDel: 'user/del.do',
    userCheck: 'user/check.do',
    userUpdate: 'user/update.do',
    userView: 'user/view.do',

    deptList: 'dept/list.do',
    tagsList: 'tags/list.do',
    imageSearch: 'image/search.do',
    watermarkList: 'image/watermarkList.do',
    imageUpload: 'image/upload.do'
  };
});
