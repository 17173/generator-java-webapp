  /**
   * 上传
   *
   * @module Upload
   */

  'use strict';

  var UploadDialog = require('../../upload/dialog');

  /**
   * FileDialog
   *
   * @class FileDialog
   * @constructor
   * @extends {Class} UploadDialog
   */
  var FileDialog = UploadDialog.extend({

    defaults: {

      title: '上传文件',

      fileName: 'file',

      uploadOptions: {
        classPrefix: 'file-upload',
        url: 'ftpAdd',
        queueOptions: {},
        selectOptions: {
          accept: '.inc,text/plain,text/html,application/javascript,text/css,text/xml,application/x-shockwave-flash,audio/mp3,.wml,application/xhtml+xml',
          label: '添加文件',
          // 1M
          maxSize: 10 * 1024 * 1024
        },
        buttonOptions: {}
      }
    }

  });

  module.exports = FileDialog;

