/**
 * URL映射
 *
 * @module common/urlmap
 * @type {JSON}
 */

define({
  //collectList: 'collectList.do',

  login: 'admin/system/login.do',
  unLogin: 'admin/system/loginout.do',

  category: 'admin/setting/category.do',
  classList: 'admin/setting/category/classList.do',

  // 分类管理
  tmplclass: 'admin/system/category/search.do',
  tmplclassSystemAdd: 'admin/system/category/add.do',
  tmplclassSystemUpdate: 'admin/system/category/update.do',
  tmplclassSystemMove: 'admin/system/category/move.do',
  tmplclassSystemDelete: 'admin/system/category/delete.do',

  // 风格管理
  styleList: 'admin/style/list.do',
  styleAdd: 'admin/style/add.do',
  styleDelete: 'admin/style/delete.do',
  styleUpdate: 'admin/style/update.do',

  //页面模板管理模块
  templatePageList: 'admin/template/page/list.do',
  templatePageAdd: 'admin/template/page/add.do',
  templatePageView: 'admin/template/page/view.do',
  templatePageDelete: 'admin/template/page/delete.do',
  templatePageUpdate: 'admin/template/page/update.do',
  templatePagePreview: 'admin/template/page/preview.htm',
  templatePageCheck: 'admin/template/page/check.do',

  //页面管理模块
  pageAdd: 'admin/page/add.do',
  pageCopy: 'admin/page/copy.do',
  pageDelete: 'admin/page/delete.do',
  pageDetail: 'admin/page/detail.do',
  pagePageNameCheck: 'admin/page/pageNameCheck.do',
  pageQuery: 'admin/page/list.do',
  pageSaveDetail: 'admin/page/saveDetail.do',
  pageUpdate: 'admin/page/update.do',
  pageGet: 'admin/page/get.do',
  pageSetLocation: 'admin/page/setLocation.do',
  pageGetContent: 'admin/page/getContent.do',
  pageSave: 'admin/page/save.do',
  pagePublish: 'admin/page/publish.do',
  pageExist: 'admin/page/isPageExist.do',
  pagePathExist: 'admin/page/isPathExist.do',
  pagePreview: 'admin/page/preview.htm',
  pageUrlGenerate: 'admin/content/generateUrl.do',

  //专题管理
  subjectList: 'admin/subject/list.do',
  subjectView: 'admin/subject/get.do',
  subjectAdd: 'admin/subject/add.do',
  subjectUpdate: 'admin/subject/update.do',
  subjectDelete: 'admin/subject/delete.do',
  subjectPathExist: 'admin/subject/isPathExist.do',
  subjectExist: 'admin/subject/isSubjectExist.do',
  subjectPreview: 'admin/subject/preview.htm',
  subjectSave: 'admin/subject/file/save.do',
  subjectPublish: 'admin/subject/file/publish.do',

  //频道管理
  channelList: 'admin/channel/list.do',
  channelSelect: 'admin/channel/select.do',
  channelGetUserChannel: 'admin/channel/getUserChannel.do',
  channelGetById : 'admin/channel/getById.do',

  // FTP文件操作 即专题文件
  ftpList: 'admin/subject/file/list.do',
  ftpAdd: 'admin/subject/file/add.do',
  ftpAddDir: 'admin/subject/file/createDir.do',
  ftpView: 'admin/subject/file/view.do',
  ftpDel: 'admin/subject/file/del.do',
  ftpDelDir: 'admin/subject/file/delDir.do',
  ftpExist: 'admin/subject/file/isFileExist.do',
  ftpUpdateCont: 'admin/subject/file/updateContent.do',

  // 专题图片
  topicList: 'admin/subject/image/search.do',
  topicDel: 'admin/subject/image/del.do',
  topicUpdate: 'admin/subject/image/update.do',
  topicUpload: 'admin/subject/image/upload.do',

  // 分类管理
  categoryList: 'admin/system/category/search.do',
  categoryAdd: 'admin/system/category/add.do',
  categoryUpdate: 'admin/system/category/update.do',
  categoryMove: 'admin/system/category/move.do',
  categoryDelete: 'admin/system/category/delete.do',

  //根据id获取分类列表
  categoryGetByIds: 'admin/system/category/getList.do',
  categoryLastCollect: 'admin/user/category/lastCollectList.do',

  //收藏分类管理
  categoryColllect: 'admin/user/category/collect.do',
  categoryUnColllect: 'admin/user/category/unCollect.do',
  categoryUnColllectAll: 'admin/user/category/unCollectAll.do',
  categoryCollectList: 'admin/user/category/collectList.do',

  // 个人收藏
  latestCollectList: 'admin/user/category/lastCollect.do',

  // 水印图
  watermarkList:'admin/watermark/list.do',
  watermarkSearch:'admin/watermark/search.do',
  watermarkUpload:'admin/watermark/upload.do',
  watermarkDelete:'admin/watermark/delete.do',
  watermarkUpdate:'admin/watermark/update.do',

  // 图片管理
  imageSearch: 'admin/image/search.do',
  imageUpdate: 'admin/image/update.do',
  imageUpload: 'admin/image/upload.do',
  imageAddWatermark: 'admin/image/addWatermark.do',
  // imageProcess: 'admin/image/imageProcess.do',

  // 专题图片管理
  imageDelete: 'admin/subject/image/del.do',

  //文章管理模块
  contentAdd: 'admin/content/add.do',
  contentUpdate: 'admin/content/update.do',
  contentDelete: 'admin/content/delete.do',
  contentList: 'admin/content/list.do',
  contentPage: 'admin/content/page.do',
  contentQuery: 'admin/content/query.do',
  contentGet: 'admin/content/getContentTemp.do',
  contentUpdateWeight: 'admin/content/updateWeight.do',
  contentUpdateCategory: 'admin/content/updateCategory.do',

  //草稿管理
  contentAddTemp: 'admin/content/addTemp.do',
  contentListTemp: 'admin/content/listTemp.do',
  contentDeleteTemp: 'admin/content/deleteTemp.do',
  contentTempGet: 'admin/content/getContentTemp.do',
  contentUpdateTemp: 'admin/content/updateTemp.do',

  //文章：获取、发布、修改、删除
  articleGet: 'admin/content/article/getArticle.do',
  articleAdd: 'admin/content/article/insert.do',
  articleUpdate: 'admin/content/article/update.do',
  articleDelete: 'admin/content/article/delete.do',
  articlePrview : 'admin/content/article/preview.htm',

  //链接：获取、发布、修改、删除
  linkGet: 'admin/content/link/getLink.do',
  linkAdd: 'admin/content/link/insert.do',
  linkUpdate: 'admin/content/link/update.do',
  linkDelete: 'admin/content/link/delete.do',

  //组图：获取、发布、修改、删除
  imagegroupGet: 'admin/content/imagegroup/getImageGroup.do',
  imagegroupAdd: 'admin/content/imagegroup/insert.do',
  imagegroupUpdate: 'admin/content/imagegroup/update.do',
  imagegroupDelete: 'admin/content/imagegroup/delete.do',
  imagegroupPrview : 'admin/content/imagegroup/preview.htm',

  //生成链接
  generateUrl : 'admin/content/generateUrl.do',

  //版权信息
  getCopyright : 'admin/content/getCopyright.do',

  // 游戏库接口
  gameList: 'admin/third/game/search.do',
  gameListByCode: 'admin/third/game/listByGameCode.do',
  gameConfig: 'admin/third/game/getGameConfig.do',

  // 组件数据源
  datasourceParamList: 'admin/datasource/param/list.do',

  // 组件源
  componentSourceList: 'admin/component/source/list.do',
  componentSourceView: 'admin/component/source/view.do',
  componentSourceAdd: 'admin/component/source/add.do',
  componentSourceEdit: 'admin/component/source/update',
  componentSourceDelete: 'admin/component/source/delete.do',
  componentSourcePreview: 'admin/component/source/preview.do',
  componentSourceCheck: 'admin/component/source/check',

  //组件模板管理模块
  componentTemplateList: 'admin/template/component/list.do',
  componentTemplateGet: 'admin/template/component/get.do',
  componentTemplateAdd: 'admin/template/component/add.do',
  componentTemplateDelete: 'admin/template/component/delete.do',
  componentTemplateUpdate: 'admin/template/component/update.do',
  componentTemplateUpdateContent: 'admin/template/component/updateContent.do',
  componentTemplateView: 'admin/template/component/view.do',
  componentTemplatePreview: 'admin/template/component/preview.htm',
  componentTemplateCheck : 'admin/template/component/check.do',

  // 组件
  componentList: 'admin/component/list.do',
  componentView: 'admin/component/view.do',
  componentPreview: 'admin/component/preview.do',
  componentAdd: 'admin/component/add.do',
  componentUpdate: 'admin/component/update.do',
  componentDelete: 'admin/component/delete.do',
  componentExport: 'admin/component/export.do',
  componentCopy: 'admin/component/copy.do',
  componentHistory: 'admin/component/history.do',
  componentAddHTML: 'admin/component/addHtml.do',
  componentUpdateHTML: 'admin/component/updateHtml.do',
  componentViewHTML: 'admin/component/viewHtml.do',
  componentCheck: 'admin/component/check.do',

  //标签
  tagsList : 'admin/third/label/getTags.do',

  //关键字
  keywordList : 'admin/third/label/getKeywords.do',

  //发布人
  userList : 'admin/user/getUserInfo.do',
  userGetByIds : 'admin/user/getUserByIds.do',

  // 获取首字母
  firstLetter : 'admin/system/firstLetter.do',
  // 获取拼音
  fullLetter : 'admin/system/fullLetter.do'
});
