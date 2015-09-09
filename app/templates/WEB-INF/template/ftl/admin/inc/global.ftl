<#global DEBUG = false>

<#if DEBUG?? && DEBUG>
  <#global seaRoot = '${ctx}/sea-modules/'>
  <#global appRoot = '${ctx}/src/app/'>
  <#global jsRoot = '${ctx}/src/js/'>
  <#global cssRoot = '${ctx}/src/css/'>
  <#global imgRoot = '${ctx}/src/img/'>
  <#global movRoot = '${ctx}/src/mov/'>
<#else>
  <#global seaRoot = 'http://ue.17173cdn.com/a/lib/'>
  <#global appRoot = '${ctx}/dist/app/'>
  <#global jsRoot = '${ctx}/dist/js/'>
  <#global cssRoot = '${ctx}/dist/css/'>
  <#global imgRoot = '${ctx}/dist/img/'>
  <#global movRoot = '${ctx}/dist/mov/'>
</#if>
