<#include '../inc/global.ftl'>

<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>后台系统 - 登录</title>
<link rel="stylesheet" href="${cssRoot}login.css">
<script>
  window.USER_DATA = {
    CTX: '${ctx}',
    USER_CODE: '${userCode}',
    USER_NAME: '${userName}',
    APP_ROOT: '${appRoot}',
    JS_ROOT: '${jsRoot}',
    MOV_ROOT: '${movRoot}',
    SEA_ROOT: '${seaRoot}'
  };
</script>
</head>
<body>
  <header>
    <i></i>
    <p>
      <#include '../inc/version.ftl'>
    </p>
  </header>
  <div id="container">
    <div id="ldap" class="login-form">

    </div>
    <footer>
      <a href="http://www.17173.com/">
        <img src="<#include '../inc/logo.ftl'>">
      </a>
      <p>Copyright &copy; <span data-role="copyright">${.now?string("yyyy")}</span> 17173.com</p>
    </footer>
  </div>
  <#include '../inc/script.ftl'>

  <script>
    seajs.use('login/index');
  </script>

</body>
</html>
