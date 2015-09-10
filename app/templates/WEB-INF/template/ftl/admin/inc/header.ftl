<header>
  <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="container-fluid">
      <div class="navbar-header">
        <a class="navbar-brand" href="/"><#include 'version.ftl'></a>
      </div>
      <div class="navbar-collapse collapse">
        <ul class="nav navbar-nav main-nav" id="J_MainMenu">
          <li data-page="demo" class="active"><a href="/demo.html" title="演示页面"> <i class="fa fa-user"></i> <span>演示页面</span></a></li>
          <#if menuList??>
            <#list menuList as menu>
              <#if menu.parentId?string == '1'>
                <#switch menu.permission>
                  <#case "admin:setting-menu">
                    <li data-page="content" data-menu-id="${menu.id}">
                      <a href="/content/article.html" title="系统设置"> <i class="fa fa-pencil-square-o"></i> <span>系统设置</span></a>
                    </li>
                    <#break>

                </#switch>
              </#if>

            </#list>
          </#if>

        </ul>

        <ul class="nav navbar-nav navbar-right">
          <li class="dropdown">
            <a href="javascript:;" class="dropdown-toggle" id="dropdownHandle">
              <i class="fa fa-user"></i>
              <span class="username">${userName}</span>
              <b class="caret"></b>
            </a>
            <ul class="dropdown-menu">
              <li><a href="/login.html" id="logoutHandle"><i class="fa fa-sign-out"></i> 退出</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</header>
