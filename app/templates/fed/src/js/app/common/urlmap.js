/**
 * URL映射
 *
 * @module common/urlmap
 * @type {JSON}
 */

define({
  collectList: 'collectList.json',

  login: 'admin/user/login.do',

  classify:'setting/classify.do',
  classList:'setting/classify/classList.do',

  tmplclass:'system/category/search.do',
  tmplclassSystemAdd:'system/category/add.do',
  tmplclassSystemUpdate:'system/category/update.do',
  tmplclassSystemDelete:'system/category/delete.do',

  styleClass:'setting/styleclass/styleclass.do',
  styleAdd:'style/add.do',
  styleDelete:'style/delete.do',
  styleUpdate:'style/update.do',

  //模板管理模块
  pageTemplateQuery:'admin/page/template/query.do',
  pageTemplateAdd:'admin/page/template/add.do',
  pageTemplateView:'admin/page/template/view.do',
  pageTemplateDelete:'admin/page/template/delete.do',
  pageTemplateUpdate:'admin/page/template/update.do',
  pageTemplatePreview:'admin/template/preview.do',

  //页面管理模块
  pageUpdate:'admin/page/update.do',
  pageDelete:'admin/page/delete.do',
  pageCopy:'admin/page/copy.do',
  pageAdd:'admin/page/add.do',
  pageSaveDetail:'admin/page/saveDetail.do',
  pageQuery:'admin/page/query.do',
  pageDetail:'admin/page/detail.do',
  pagePageNameCheck:'admin/page/pageNameCheck.do',

  //专题管理
  featureList: 'admin/page/specialTopic/query',
  featureDelete: 'admin/page/specialTopic/delete',

  // FTP文件操作
  ftpList: 'ftp/list',
  ftpAdd: 'ftp/add',
  ftpAddDir: 'ftp/createDir',
  ftpDel: 'ftp/del',
  ftpDelDir: 'ftp/delDir',

  //根据id获取分类列表
  categoryGetByIds:'admin/system/category/getByIds.do',
  categoryLastCollect:'admin/user/category/lastCollect.do',
  categoryMove:'admin/system/category/move.do',


  // 个人收藏
  latestCollectList: 'admin/user/category/lastCollect.do',

  //图片上传口
  // imageUpload:'admin/image/upload.do',
  imageUpload:'admin/image/imageUpload.json',
  watermarkList: 'admin/image/watermarkList.json',
  // imageProcess: 'admin/image/imageProcess.json',

  //文章管理模块
  contentAdd:'/content/add.do',
  contentUpdate:'content/update.do',
  contentDelete:'content/delete.do',
  contentList:'content/list.do',
  contentPage:'content/page.do',

  //草稿管理
  contentAddTemp:'content/addTemp.do',
  contentListTemp:'content/listTemp.do',
  contentDeleteTemp:'content/deleteTemp.do',


  // 游戏库接口
  gameList: 'gamelib/search.do',
  gameListByCode: 'gamelib/listByGamecodes.do',

  // 组件数据源
  datasourceParamList: 'datasource/param/list',

  // 组件源
  componentSourceList: 'component/source/list',
  componentSourceView: 'component/source/view',
  componentSourceAdd: 'component/source/add',
  componentSourceEdit: 'component/source/add',
  componentSourceDelete: 'component/source/delete'
});
