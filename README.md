# generator-java-webapp  [![Build Status](https://secure.travis-ci.org/17173/generator-java-webapp.png?branch=master)](https://travis-ci.org/17173/generator-java-webapp)

```
快速构建 java web 项目的前端脚手架（bootstrap+seajs+fed）
```     
     
 **构建成功后的工程目录结构说明：**
 
 ```
| -- WEB-INF
    |-- template                         # 模板文件
        |-- ftl                              # freemarker模版
            |-- admin/                    # 后台模版
            |-- front/                      # 前台模版
|-- src                               # 开发的前端资源目录
    |-- app/                              # 业务脚本
        |-- commmon/                     # 业务公共模块
        |-- admin/                      # 后台业务
        |-- front/                       # 前台业务
    |-- images/                          # 图片
    |-- css/                             # 样式
    |-- fonts/                          # 字体
    |-- js/                    # 非 cmd 模块的脚本，重构调用的
|-- sea-modules/               # 通过 spm 安装的 seajs 模块目录
|-- config.json                       # fed 配置文件
|-- package.json
|-- Gruntfile.js
|-- mock/                             # 数据模拟
|-- dist/                               # 最终压缩上线后的目录
|-- inc-global       # UI/UE推送的静态内容(正式环境将对本目录建立软链接，访问该目录实际访问的是上级同名目录)
|-- inc-site         # UI/UE推送的静态内容(正式环境将对本目录建立软链接，访问该目录实际访问的是上级同名目录)

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
* [java-webpp:page](#page)
* [java-webapp:admin](#admin)
* [java-webapp:front](#front)
* [java-webapp:mock](#mock)
* [java-webapp:fed](#fed)

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
yo java-webapp:page myapp/login
```

生成 src/app/myapp/login/main.js

```
define(function(require, exports, module) {
    //code
});
```

生成 src/app/myapp/login/package.json

```
{
    "family": "app",
    "name": "login",
    "version": "0.0.0",
    "spm": {
        "alias": {
            
        },
        "output": ["main.js"]
    }
}
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
        seajs.use('${jsRoot}/app/myapp/login/main.js');
    </script>
</@inc.footer>
```

### admin

创建一个后台业务模块，最终生成3个文件

**举例：**

```
yo java-webapp:admin mypage
```

生成 src/app/admin/mypage/main.js

```
define(function(require, exports, module) {
    //code
});
```

生成 src/app/admin/mypage/package.json

```
{
    "family": "app",
    "name": "mypage",
    "version": "0.0.0",
    "spm": {
        "alias": {
            
        },
        "output": ["main.js"]
    }
}
```

生成 WEB-INF/template/ftl/admin/mypage/index.ftl

```
<#import '/WEB-INF/template/ftl/admin/inc/inc.ftl' as inc />

<@inc.header '页面标题'>

</@inc.header>
<@inc.body '页面菜单名'>
    <p>这是页面内容</p>
</@inc.body>
<@inc.footer>
    <script type="text/javascript">
        seajs.use('${jsRoot}/app/admin/mypage/main.js');
    </script>
</@inc.footer>
```

### front

创建一个前台业务模块，最终生成2个文件，因前台的页面模板是可变的，所以不做业务对应 ftl 文件的生成

**举例：**

```
yo java-webapp:front mypage
```

生成 src/app/front/mypage/main.js

```
define(function(require, exports, module) {
    //code
});
```

生成 src/app/front/mypage/package.json

```
{
    "family": "app",
    "name": "mypage",
    "version": "0.0.0",
    "spm": {
        "alias": {
            
        },
        "output": ["main.js"]
    }
}
```

### Mock

创建 mock 文件，采用 [fed](https://github.com/ijse/FED) 模拟的接口数据文件

**举例：**

```
yo java-webapp:mock mypage
```

生成 mock/mypage.js

```
/**
 * 获取后台 ftl 文件路径
 *
 * @param s
 * @returns {string}
 */
var getFile = function(s) {
    return 'WEB-INF/template/ftl/' + s;
};
module.exports = {
    "get /url": function(req, res) {
        this.render.ftl(getFile('path'), {});
    },
    "post /url": function(req, res) {
        this.render.ftl(getFile('path'), {});
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
        "port": "3000",
        "path": {
            "view": "",
            "mock": "mock",
            "public": ""
        },
        "globals": {
            "baseUrl": "",
            "basePath": "http://www.ijser.cn/"
        }
    },
    "coffeescript": {
        "debug": false
    }
}
```

## Testing

## Contribute

## ChangeLog

见 [CHANGELOG.md](https://github.com/17173/generator-java-webapp/blob/master/CHANGELOG.md)

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/17173/generator-java-webapp/trend.png)](https://bitdeli.com/free "Bitdeli Badge")


