<#import '/WEB-INF/template/ftl/admin/inc/inc.ftl' as inc />

<@inc.header '页面标题'>

</@inc.header>
<@inc.body '页面菜单名'>
    <p>这是页面内容</p>
</@inc.body>
<@inc.footer>
    <script type="text/javascript" data-main="<%= jsRoot %>/js/<%= _.slugify(name) %>" src="<%= jsRoot %>/js/require.js"></script>
</@inc.footer>