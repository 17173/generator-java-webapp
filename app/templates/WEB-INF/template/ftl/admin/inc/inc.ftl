<#include 'global.ftl'>

<#macro header title>
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="utf-8">
  <meta http-equiv="cache-control" content="no-cache" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title!''}</title>
  <script>
    window.USER_DATA = {
      CTX: '${ctx}',
      USER_CODE: '${userCode!""}',
      USER_NAME: '${userName!""}',
      APP_ROOT: '${appRoot}',
      JS_ROOT: '${jsRoot}',
      MOV_ROOT: '${movRoot}',
      SEA_ROOT: '${seaRoot}',
      AUTH_LIST: ${menuListJson}
    };
    if (!window.USER_DATA.USER_CODE) {
      //window.location.href = '/login.html?' + new Date().getTime();
    }

/*    (function(){
      var authList = window.USER_DATA.AUTH_LIST || [];
      var authDictionary = {};
      authList.forEach(function(item) {
          var name = item.permission.substr(6).replace(/:/g, '');
          name = name.toLocaleLowerCase();
          authDictionary[name] = item;
      });
      function compile(template, datas) {
          if (!datas) {
              return template;
          }
          return template.replace(/\{\{(\w+)\}\}/g, function(match, sub1) {
              return datas[sub1] || match;
          });
      }
      window.AUTH = {
          auths: authDictionary,
          isAuth : function(key){
            return authDictionary[key.toLocaleLowerCase()];
          },
          filter: function(map, datas) {
              var hasAuths = [];
              for (var authName in map) {
                //有一个权限控制多个按钮的场景，但属性名又不能重复，所以增加_123这种形式。
                var key = authName.toLocaleLowerCase().replace(/_\d+/g,'');
                authDictionary[key] && hasAuths.push(compile(map[authName], datas));
              }
              return hasAuths;
          }
      };
    }());*/

  </script>

  <link href="${cssRoot}app.css" rel="stylesheet">
  <#nested>
</head>
</#macro>

<#macro body menu="菜单名称" cls='page-index'>
  <body class="${cls}">
  <#include 'header.ftl'>
  <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
    <div class="row">
      <h1 class="page-header">${menu}</h1>
      <#nested>
      <#include 'footer.ftl'>
    </div>
  </div>
</#macro>

<#macro breadcrumb crumbs>
  <div class="crumb">
    <ol class="breadcrumb">
    <#list crumbs as crumb>
      <li<#if !(crumb_has_next)> class="active"</#if>>
        <#if crumb[1] != ''>
          <a href="${crumb[1]}">${crumb[0]}</a>
        <#else>
          ${crumb[0]}
        </#if>
      </li>
    </#list>
    </ol>
  </div>
</#macro>

<#macro tabs tabArray currentTab>
  <ul class="nav nav-tabs" data-role="tabs">
    <#list tabArray as tab>
      <li<#if (tab[0] == currentTab || tab[1] == currentTab)> class="active"</#if>>
        <a href="${tab[1]}" data-role="tab">${tab[0]}</a>
      </li>
    </#list>
  </ul>
</#macro>

<#macro menu pid isTab=false tabId=''>
  <#if menuList??>
    <#list menuList as menu>
      <#if menu.id?? && menu.id?string == pid>
        <h4>
          <i class="fa fa-minus-square-o"></i>
          ${menu.name}</h4>
        <#break>
      </#if>
    </#list>
    <ul class="nav-sidebar" id="${tabId!''}">
      <#list menuList as menu>
        <#if menu.parentId?? && menu.parentId?string == pid>
          <li><a <#if isTab>data-role="tab"</#if> href="${menu.url}"><i class="fa fa-angle-right"></i> ${menu.name}</a></li>
        </#if>
      </#list>
    </ul>
  </#if>
</#macro>

<#macro footer>
  <#include 'script.ftl'>
  <script>
  seajs.use('header/index');
  </script>
  <#nested>
</body>
</html>
</#macro>
