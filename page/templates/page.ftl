<#import '<%= incPath %>' as inc />

<@inc.header '页面标题'>

</@inc.header>
<@inc.body 'cls'>
  <p>这是页面内容</p>
</@inc.body>
<@inc.footer>
  <script>
    seajs.use('<%= name %>/index');
  </script>
</@inc.footer>
