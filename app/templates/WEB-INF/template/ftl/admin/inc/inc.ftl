<#include "global.ftl">
<#if DEBUG?? && DEBUG>
  <#global jsRoot = '${ctx}/fed/src/js'>
  <#global appRoot = '${ctx}/fed/src/app'>
  <#global cssRoot = '${ctx}/fed/src/css'>
  <#global imgRoot = '${ctx}/fed/src/img'>
<#else>
  <#assign cdn = 'http://ue.17173cdn.com'>
  <#global jsRoot = '${ctx}/dist'>
  <#global appRoot = '${ctx}/dist/app'>
  <#global cssRoot = '${ctx}/dist/css'>
  <#global imgRoot = '${ctx}/dist/img'>
</#if>

<#macro header title>
  <!DOCTYPE HTML>
  <html>
  <head>
    <title>${title!''}</title>
    <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <link rel="stylesheet" href="${cssRoot}/app.css" />
    <script>
      window.GLOBAL = {
        CTX: '${ctx}'
      }
    </script>
    <#nested>

  </head>
</#macro>
<#macro body menu="菜单名" cls="page">
  <body class="${cls}">
    <div class="wrapper">
      <#include 'header.ftl'>
      <#include 'nav.ftl'>
      <section>
        <div class="content-wrapper">
          <#nested>
        </div>
      </section>
    </div>

</#macro>
<#macro footer>
  <#include 'script.ftl'>
    <script>
      seajs.use(['${appRoot}/common/layout.js']);
    </script>
    <#nested>
    </body>
    </html>
</#macro>
