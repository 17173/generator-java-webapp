# generator-java-webapp  [![Build Status](https://secure.travis-ci.org/17173/generator-java-webapp.png?branch=master)](https://travis-ci.org/17173/generator-java-webapp)

```
快速构建 java web 项目的前端脚手架（bootstrap+requirejs+fed），目前只适合后台的开发
```     
     
 webapp下的工程目录结构（只写前端需要的）
 
 ```
| -- WEB-INF
    |-- template                         # 模板文件
        |-- ftl                              # freemarker模版
            |-- admin                    # 后台模版
            |-- front                      # 前台模版
|-- admin                             # 后台
    |-- static                        # 无需CDN静态资源目录
        |-- css                         
        |-- images                    
        |-- js
        	|-- app/
            |-- common/
            |-- lib/
            |-- page/
            |-- main.js
            |-- require.js
|-- front                              # 前台
    |-- static                         # 无需CDN静态资源目录
        |-- css                        
        |-- images                  
        |-- js                          
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
* [java-webapp:page](#page)
* [java-webapp:mock](#mock)

### java-webapp

按 java web 的目录规范，创建前端工程目录文件

举例：

```
yo java-webapp
```

### Page

创建一个业务模块，最终生成三个文件

举例：

```
yo java-webapp:page mypage
```

生成 admin/static/js/page/mypage.js

```
require(['../main'], function (main) {
    require(['app/mypage']);
});
```

生成 admin/static/js/app/mypage.js

```
define(['jquery'],function($) {

});
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
    <script type="text/javascript" data-main="${static}/js/mypage" src="${static}/js/require.js"></script>
</@inc.footer>
```
### Mock

创建 mock 文件，采用 [fed](https://github.com/ijse/FED) 模拟的接口数据文件

举例：

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
var adminUrl = function(s) {
    return 'WEB-INF/template/ftl/admin/' + s;
};
module.exports = {
    "get /url": function(req, res) {
        this.render.ftl(adminUrl('path'), {});
    },
    "post /url": function(req, res) {
        this.render.ftl(adminUrl('path'), {});
    }

};
```

## Testing

## Contribute

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)





