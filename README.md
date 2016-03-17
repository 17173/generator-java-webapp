# generator-java-webapp  [![Build Status](https://secure.travis-ci.org/17173/generator-java-webapp.png?branch=master)](https://travis-ci.org/17173/generator-java-webapp)

```
快速构建 java web 项目的后台前端脚手架（bootstrap+seajs+fed）
```

> 注：此脚手脚只适用 17173 内部使用, 外部人员慎用    

**构建成功后的工程目录结构说明：**

```
|- src/
  |- app                     #seajs模块化文件
    | - common               # 公共模块
    | - mod1
    | - ...
  |- css                     #样式文件
  |- font                    #字体
  |- img                     #图片
  |- less                    # 存放less文件
    | - app                  # 业务样式
      | - base               
      | - component
      | - layout
      | - page
      | - app.less
      | - login.less
    | - awesome              # font-awesome
    | - bootstrap            # bootstrap
  |- js                      #脚本文件，存放所有非模块化文件
    |- sea-config.js         #seajs配置文件
  |- mov                     #视频，音频文件
|- mock                      #mock文件
  | - _globals.json # 全局配置文件
  | - _map  # mock mapping file
  | - permission.js 权限 mock file
|- node_modules
|- spm_modules
|- Gulpfile.js
|- server.js
|- .jshintrc
|- .editorconfig
|- package.json
|- README.md
|- dist/                     #部署文件
|- WEB-INF/                  #java 模板文件

```

## Usage

安装 generator-java-webapp:

```
npm install -g generator-java-webapp
```

如已有安装过, 请执行 update

```
npm update generator-java-webapp -g
```

创建一个 java web 项目目录，cd到目录下:

```
mkdir my-new-project && cd $_
```

运行 yo java-webapp，可选择性的输入你的工程名，如无输入即你的工程目录名

```
yo java-webapp [app-name]
```

## Generators

可用的生成器：

* [java-webapp](#java-webapp)(aka [java-webapp:app](#java-webapp))
* [java-webapp:page](#page)
* [java-webapp:mock](#mock)
* [java-webapp:js](#js)
* [java-webapp:ftl](#ftl)

### java-webapp

按 java web 的目录规范，创建前端工程目录文件

**举例：**

```
yo java-webapp
```
### page

自定义一个业务模块，最终生成3个文件, 用”/“，生成带目录的文件

**举例：**

```
yo java-webapp:page login
```

生成 src/app/login/index.js

```
'use strict';

//code

```


生成 WEB-INF/template/ftl/admin/login/index.ftl

```
<#import '/WEB-INF/template/ftl/inc/inc.ftl' as inc />

<@inc.header '页面标题'>

</@inc.header>
<@inc.body '页面菜单名'>
    <p>这是页面内容</p>
</@inc.body>
<@inc.footer>
    <script>
        seajs.use('login/index');
    </script>
</@inc.footer>
```

生成 mock/login.html.js

```
var permission = require('./permission');

module.exports = function(req, res, next) {
  res.render('template/ftl/admin/login/index.ftl', { menuList: permission.menuList, menuListJson: permission.menuListJson });
};

```

### Mock

创建 mock 文件，采用 [fed](https://github.com/ijse/FED) 模拟的接口数据文件

**举例：**

```
yo java-webapp:mock mypage
```

生成 mock/mypage.js, mockjs 规则见 [http://mockjs.com/](http://mockjs.com/)

```
var Mock = require('mockjs');

module.exports = function(req, res, next) {
  var data = {
    result: 'success',
    messages: [],
    data: {
      id: '@id',
      name: '@name'
      'sex|0-1': 0
    }
  };
  data = JSON.stringify(Mock.mock(data));
  res.end(data);
};

```

### js

创建一个 js 文件

**举例：**

```
yo java-webapp:js myapp
```

生成 myapp.js

```
'use strict';

// code

```

### ftl

创建一个 ftl 文件

**举例：**

```
yo java-webapp:ftl myapp
```

生成 myapp.ftl

```
<#import '../inc/inc.ftl' as inc />

<@inc.header '页面标题'>

</@inc.header>
<@inc.body ''>
    <p>这是页面内容</p>
</@inc.body>
<@inc.footer>
    
</@inc.footer>
```

## 特性

* 支持 less/stylus
* 支持 livereload
* 支持 freemarker
* 采用 seajs 模块化

## 日志

见 [CHANGELOG.md](https://github.com/17173/generator-java-webapp/blob/master/CHANGELOG.md)

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/17173/generator-java-webapp/trend.png)](https://bitdeli.com/free "Bitdeli Badge")


