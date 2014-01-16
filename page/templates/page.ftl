<#import '/WEB-INF/template/ftl/admin/inc/inc.ftl' as inc />

<@inc.header '页面标题'>

</@inc.header>
<@inc.body '页面菜单名'>
    <p>这是页面内容</p>
</@inc.body>
<@inc.footer>
    <script type="text/javascript">
        seajs.use('<%= jsRoot %>/js/app/<%= _.slugify(name) %>/main.js');
    </script>
</@inc.footer>