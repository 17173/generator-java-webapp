<#global assetsRoot = '${ctx}/fed/docs/assets'>
<#global docs = '${ctx}/docs'>
<#global appRoot = '${ctx}/fed/src/app'>

<#macro header title>
  <!DOCTYPE HTML>
  <html>
  <head>
    <title>${title!'文档'}</title>
    <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <link rel="stylesheet" href="${assetsRoot}/css/bootstrap.min.css" />
    <link rel="stylesheet" href="${assetsRoot}/css/docs.min.css" />
    <link rel="stylesheet" href="${assetsRoot}/css/app.css" />
    <script>
      window.GLOBAL = {
        CTX: '${ctx}'
      }
    </script>
    <#nested>

  </head>
</#macro>
<#macro body>
  <#include 'header.ftl'>
  <div class="bs-docs-header" id="content">
      <div class="container">
        <h1>项目名</h1>
        <p>项目介绍</p>
      </div>
  </div>
  <div class="container bs-docs-container">
    <div class="row">
        <div role="main" class="col-md-9">
        <#nested>
      </div>
      <div class="col-md-3">
        <div role="complementary" class="bs-docs-sidebar hidden-print hidden-xs hidden-sm">
            <#include 'menu.ftl'>
        </div>
      </div>

    </div>
  </div>
</#macro>
<#macro footer>
  <#include 'script.ftl'>
    <#nested>
    </body>
    </html>
</#macro>
