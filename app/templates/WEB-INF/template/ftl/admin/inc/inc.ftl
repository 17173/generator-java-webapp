<#global DEBUG = true>
<#if DEBUG?? && DEBUG>
    <#global jsRoot = '${ctx}/src'>
    <#global cssRoot = '${ctx}/src/css'>
    <#global imgRoot = '${ctx}/src/img'>
<#else>
    <#global jsRoot = '${ctx}/dist'>
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
    <link rel="stylesheet" href="${cssRoot}/bootstrap.css" />

    <link rel="stylesheet" href="${cssRoot}/light-theme.css" />
    <link rel="stylesheet" href="${cssRoot}/theme-colors.css" />
    <link rel="stylesheet" href="${cssRoot}/admin.css" />
    <#nested>
    
</head>
</#macro>
<#macro body menu>
<body class="contrast-sea-blue fixed-header fixed-navigation">

<#include 'header.ftl'>
<div id='wrapper'>
    <div id='main-nav-bg'></div>
    <nav id='main-nav' class="main-nav-fixed">
        <#include 'nav.ftl'>
    </nav>
    <section id="content">
        <div class='container'>
            <div class='row' id='content-wrapper'>
                <div class="col-xs-12">
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="page-header">
                                <h1 class="pull-left">
                                    <i class="icon-cog"></i>
                                    <span>${menu!''}</span>
                                </h1>
                            </div>
                        </div>
                    </div>
                    <#nested>
                </div>
            </div>
            <#include 'footer.ftl'>
        </div>
    </section>
</div>
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