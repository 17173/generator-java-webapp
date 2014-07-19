define(function(require, exports, module) {

  /**
   * 全站公共引入的业务初始模块
   * 一般无需有返回值
   * 场景如：
   * 1.头部业务的初始
   * 2.边栏菜单的初始
   * 注意：
   * 不意见一个页面有两个以上的 seajs.use，所以才有这样的一个 global.js，
   * 这样每个页面的会加载一个 global 和一个主业务脚本，或
   * 页面只加载主业务脚本，再由主业务脚本去 require global
   */

  console.log('global')
});