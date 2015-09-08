<#import '../inc/inc.ftl' as inc>

<@inc.header '演示页'>
</@inc.header>

<@inc.body '演示页'>

  <@inc.breadcrumb [['首页', ''], ['演示页', '']]></@inc.breadcrumb>

  <div id="contents" class="well">
    <h3>Welcome to Demo!</h3>
  </div>

  <#include 'menu.ftl'>
</@inc.body>

<@inc.footer>

</@inc.footer>
