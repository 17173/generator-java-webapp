# 开始

## 环境配置

1. 安装 NODE
  - http://nodejs.org/dist/v0.10.26/x64/node-v0.10.26-x64.msi

2. 安装 GRUNT
  - npm install grunt-cli -g
  - npm config set registry http://10.5.121.139:8888

3. 安装 SPM
  - npm install spm@2.2.7 -g
  - spm config source:default.url http://10.5.121.139:3000

  > spm 账号

  > username: spm

  > password: password

4. 安装 JAVA
  - \\10.5.17.41\software\public\Java\jdk-7u25-windows-x64.exe

5. 安装 FED
  - npm install coffee-script -g
  - npm install fed2 -g
  - npm install socket.io -g

6. 最后，工程目录下执行命令行
  - npm install
  - spm install
  - grunt fed

7. 浏览器访问：http://127.0.0.1:3001
    
  > 访问开发环境

8. 浏览器访问：http://127.0.0.1:8000
    
  > 访问文档

## 查看文档

在浏览器端查看 md 文档，如果安装了 socket.io 的话，将会有 live reload 功能。

```
grunt doc
```

## 代码发布

  ```
  grunt build
  ```

  > fed 目录不发布到线上

## 接口文档

## 需求文档


## 联调环境


## 代码仓库


## 开启 debug 模式

在地址栏加 ?seajs-style&seajs-debug, 就可开启 debug 模式

debug 具体用法见 [https://github.com/seajs/seajs-debug/issues/4](https://github.com/seajs/seajs-debug/issues/4)

