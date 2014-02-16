<#global ctx = 'http://localhost:8080'>
<#global DEBUG = true>
<#if DEBUG?? && DEBUG>
    <#global jsRoot = '${ctx}/src'>
    <#global cssRoot = '${ctx}/css'>
    <#global imgRoot = '${ctx}/img'>
<#else>
    <#global jsRoot = '${ctx}/dist'>
    <#global cssRoot = '${ctx}/css'>
    <#global imgRoot = '${ctx}/img'>
</#if>

<#macro header title>
<!DOCTYPE HTML>
<html>
<head>
    <title>${title!''}</title>
    <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="stylesheet" href="${cssRoot}/bootstrap.css" />

    <#nested>
    
</head>
</#macro>
<#macro body menu>
<body>

<#include 'header.ftl'>
<div class="container">

    <div class="row row-offcanvas row-offcanvas-right">
        <#nested>
        
    </div><!--/row-->

    <hr>

    <#include 'footer.ftl'>

</div><!--/.container-->
</#macro>
<#macro footer>
    <script type="text/javascript" src="${ctx}/sea-modules/seajs/seajs/2.1.1/sea.js"></script>
    <script type="text/javascript" src="${ctx}/sea-modules/seajs/seajs-style/1.0.2/seajs-style.js"></script>
    <script type="text/javascript">
        <#if DEBUG?? && DEBUG>
            seajs.config({
                base: '${ctx}/sea-modules/',
                alias: {
                    "jquery": "jquery/jquery/1.10.1/jquery"
                },
                debug: true
            });
        <#else>
            seajs.config({
                base: '${jsRoot}'
            }); 
        </#if>
    </script>
    <#nested>
</body>
</html>
</#macro>