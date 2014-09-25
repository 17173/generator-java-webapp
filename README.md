# generator-java-webapp  [![Build Status](https://secure.travis-ci.org/17173/generator-java-webapp.png?branch=master)](https://travis-ci.org/17173/generator-java-webapp)

```
快速构建 java web 项目的前端脚手架（bootstrap+seajs+fed）
```     

**构建成功后的工程目录结构说明：**

```
|- fed/                        #前端源文件
  |- src/
    |- app                     #seajs模块化文件
    |- css                     #样式文件
    |- font                    #字体
    |- img                     #图片
    |- less                    # 存放less文件
    |- js                      #脚本文件，存放所有非模块化文件
      |- sea-config.js         #seajs配置文件
    |- mov                     #视频，音频文件
  |- mock                      #mock文件
  |- docs                      #基于bootstrap主题的文档及demo
  |- node_modules
  |- sea-modules
  |- fed.json                  #fed 配置文件
  |- Gruntfile.js
  |- .jshintrc
  |- .editorconfig
  |- package.json
  |- README.md
  |- dist/                     #部署文件
  |- test/                     #单元测试
|- WEB-INF/                    #java 模板文件

```

## Usage

安装 generator-java-webapp:

```
npm install -g generator-java-webapp
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
* [java-webapp:admin](#admin)
* [java-webapp:front](#front)
* [java-webapp:mock](#mock)
* [java-webapp:fed](#fed)
* [java-webapp:js](#js)
* [java-webapp:ftl](#ftl)

### java-webapp

按 java web 的目录规范，创建前端工程目录文件

**举例：**

```
yo java-webapp
```
### page

自定义一个业务模块，最终生成2个文件, 用”/“，生成带目录的文件

**举例：**

```
yo java-webapp:page myapp/login
```

生成 src/app/myapp/login/index.js

```
define(function(require, exports, module) {
    //code
});
```


生成 WEB-INF/template/ftl/myapp/login/index.ftl

```
<#import '/WEB-INF/template/ftl/inc/inc.ftl' as inc />

<@inc.header '页面标题'>

</@inc.header>
<@inc.body '页面菜单名'>
    <p>这是页面内容</p>
</@inc.body>
<@inc.footer>
    <script type="text/javascript">
        seajs.use('${appRoot}/myapp/login/index.js');
    </script>
</@inc.footer>
```
### admin

自定义一个后台业务模块，最终生成2个文件, 用”/“，生成带目录的文件

**举例：**

```
yo java-webapp:admin myapp/login
```

生成 src/app/myapp/login/index.js

```
define(function(require, exports, module) {
    'use strict';
});
```


生成 WEB-INF/template/ftl/admin/myapp/login/index.ftl

```
<#import '/WEB-INF/template/ftl/admin/inc/inc.ftl' as inc />

<@inc.header '页面标题'>

</@inc.header>
<@inc.body '页面菜单名'>
    <p>这是页面内容</p>
</@inc.body>
<@inc.footer>
    <script type="text/javascript">
        seajs.use('${appRoot}/myapp/login/index.js');
    </script>
</@inc.footer>
```
### front

自定义一个前台业务模块，最终生成2个文件, 用”/“，生成带目录的文件

> 前台只是做预留，如用的场景多再做优化

**举例：**

```
yo java-webapp:front myapp/login
```

生成 src/app/front/myapp/login/index.js

```
define(function(require, exports, module) {
    'use strict';
});
```


生成 WEB-INF/template/ftl/front/myapp/login/index.ftl

```
<#import '/WEB-INF/template/ftl/front/inc/inc.ftl' as inc />

<@inc.header '页面标题'>

</@inc.header>
<@inc.body '页面菜单名'>
    <p>这是页面内容</p>
</@inc.body>
<@inc.footer>
    <script type="text/javascript">
        seajs.use('${appRoot}/front/myapp/login/index.js');
    </script>
</@inc.footer>
```


### Mock

创建 mock 文件，采用 [fed](https://github.com/ijse/FED) 模拟的接口数据文件

**举例：**

```
yo java-webapp:mock mypage
```

生成 mock/mypage.js

```
var common = require('./common');
var store = common.store;
var getFile = common.getFile;
module.exports = {
    // mock 请求
    "post /url": function(req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": {

            }
        });
    },
    // mock freeMarker 文件
    "get /url": function(req, res) {
        this.render.ftl(getFile('path'), store);
    }

};
```
### fed

创建一个 fed 配置文件

**举例：**

```
yo java-webapp:fed config
```

生成 config.json

```
{
    "server": {
        "port": "8080",
        "path": {
            "view": "",
            "mock": "mock",
            "public": ""
        },
        "globals": {
            "baseUrl": "",
            "basePath": ""
        }
    },
    "coffeescript": {
        "debug": false
    }
}
```

### js

创建一个 js 文件

**举例：**

```
yo java-webapp:js myapp
```

生成 myapp.js

```
define(function(require, exports, module) {
    var $ = require('$');

});
```

### ftl

创建一个 ftl 文件

**举例：**

```
yo java-webapp:ftl myapp
```

生成 myapp/index.ftl

```
<#import '/WEB-INF/template/ftl/inc/inc.ftl' as inc />

<@inc.header '页面标题'>

</@inc.header>
<@inc.body ''>
    <p>这是页面内容</p>
</@inc.body>
<@inc.footer>
    
</@inc.footer>
```

## Testing

## Contribute

## ChangeLog

见 [CHANGELOG.md](https://github.com/17173/generator-java-webapp/blob/master/CHANGELOG.md)

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/17173/generator-java-webapp/trend.png)](https://bitdeli.com/free "Bitdeli Badge")


