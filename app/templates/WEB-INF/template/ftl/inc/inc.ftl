<#include 'global.ftl'>
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
  <body class="contrast-sea-blue fixed-header fixed-navigation ${cls}">

  <#include 'header.ftl'>
    <div class="container">

      <div class="row row-offcanvas row-offcanvas-right">

        <div class="col-xs-12 col-sm-9">
          <#nested>
        </div><!--/span-->

        <div class="col-xs-6 col-sm-3 sidebar-offcanvas" id="sidebar" role="navigation">
          <#include 'nav.ftl'>
        </div><!--/span-->
      </div><!--/row-->

      <hr>

      <#include 'footer.ftl'>

    </div><!--/.container-->

</#macro>
<#macro footer>
  <#include 'script.ftl'>
    <#nested>
    </body>
    </html>
</#macro>