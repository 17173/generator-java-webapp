### v2.0.7 (2016-3-17)

* spm2 升级到 spm3
* 添加 mockjs

### v2.0.6 (2015-9-8)

做大更改，新版只适用企业级后台运用

* 去掉 fed 目录包裹
* 去掉 nico 文档
* fed2 升级到 fed3
* 默认采用 cms3 主题
* 支持 livereload
* 引入常用的公共模块包
* 默认 demo 包含，表格查询、行修改、行删除，表单创建，图片上传，编辑器

### v1.0.7 (2014-8-23)
* 去掉 flat-ui，完善后台主题
* 重新引入子生成器 admin 和 front

### v1.0.6 (2014-7-19)
* 引入基于 pandora 常用的 common
* 添加 flat-ui 主题

### v1.0.5 (2014-6-16)
* 前端资源文件放入 fed/src
* 支持 nico 生成文档
* 用 less 管理样式，并引入 font-awesome
* 去掉 子生产器 inc
* app 目录与 js 目录并列，和已有项目统一

### v1.0.4 (2014-5-6)
* 调整前端目录

### v1.0.3 (2014-3-28)

* 主题改为 bootstrap3 默认主题
* 只保留 hello 的例子
* 去除 admin 和 front 子生产器，如需要，通过 page 及 inc 生成
* sea配置，用单独文件方式引用
* boostrap,seajs,jquery 引用线上 cdn 地址
* 添加 grunt-fed，可用 grunt server ,运行服务
* 修改细节

### v1.0.2 (2014-2-19)

* ctx 全局变量， 在 mock 定义，而不在 inc.ftl 写死

### v1.0.1 (2014-2-10)

* 新增 page 子生成器
* 新增 inc 子生成器
* mock 支持目录形式创建
* 调整前端目录

### v1.0.0 (2014-1-16)
* 放弃 requirejs, 改用 seajs
* 调整目录结构

### v0.0.1 (2014-01-09)
* 初始版本
