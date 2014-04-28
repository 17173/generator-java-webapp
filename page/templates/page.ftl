<#import '/WEB-INF/template/ftl/inc/inc.ftl' as inc />

<@inc.header '页面标题'>

</@inc.header>
<@inc.body 'cls'>
    <p>这是页面内容</p>
</@inc.body>
<@inc.footer>
    <script type="text/javascript">
        seajs.use('<%= appRoot %>/<%= name %>/index.js');
    </script>
</@inc.footer>