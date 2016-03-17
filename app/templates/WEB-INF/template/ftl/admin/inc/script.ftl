<script src="http://ue.17173cdn.com/a/lib/jquery-2.1.1.min.js"></script>
<#if DEBUG?? && DEBUG>
  <script src="${jsRoot}sea-debug.js"></script>
  <script src="${jsRoot}seajs-text.js"></script>
  <script src="${jsRoot}seajs-wrap.js"></script>
<#else>
  <script src="${jsRoot}sea.js"></script>
</#if>
<script src="${jsRoot}ace/ace.js"></script>
<script src="${jsRoot}sea-config.js"></script>
