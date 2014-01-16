<#global ctx = 'http://localhost:3000'>
<#global static = ctx>
<#macro header title>
<!DOCTYPE HTML>
<html>
<head>
    <title>${title!''}</title>
    <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="stylesheet" href="${static}/css/bootstrap.css" />

    <link rel="stylesheet" href="${static}/css/light-theme.css" />
    <link rel="stylesheet" href="${static}/css/theme-colors.css" />
    <#nested>
    <link rel="stylesheet" href="${static}/css/admin.css" />
    <script type="text/javascript">
        window.SEA_BASE = '${static}/js/sea-modules/';
    </script>
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
    <script type="text/javascript" src="${static}/js/sea-modules/seajs/seajs/2.1.1/sea.js"></script>
    <script type="text/javascript" src="${static}/js/sea-config.js"></script>
    <#nested>
</body>
</html>
</#macro>