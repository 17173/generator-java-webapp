'use strict';

/*global tinymce:true */

tinymce.PluginManager.add('preview', function(editor) {
	var settings = editor.settings;

	function preview() {
		var previewHtml, headHtml = '';

		headHtml += '<meta charset="utf-8">';
		headHtml += '<title>' + tinymce.i18n.translate('Preview') + '</title>';

		if (editor.settings['document_base_url'] !== editor.documentBaseUrl) {
			headHtml += '<base href="' + editor.documentBaseURI.getURI() + '">';
		}

		tinymce.each(editor.contentCSS, function(url) {
			headHtml += '<link rel="stylesheet" href="' + editor.documentBaseURI.toAbsolute(url) + '">';
		});

		var bodyId = settings['body_id'] || 'tinymce';
		if (bodyId.indexOf('=') != -1) {
			bodyId = editor.getParam('body_id', '', 'hash');
			bodyId = bodyId[editor.id] || bodyId;
		}

		var bodyClass = settings['body_class'] || '';
		if (bodyClass.indexOf('=') != -1) {
			bodyClass = editor.getParam('body_class', '', 'hash');
			bodyClass = bodyClass[editor.id] || '';
		}

		var dirAttr = editor.settings.directionality ? ' dir="' + editor.settings.directionality + '"' : '';

		previewHtml = (
			'<!DOCTYPE html>' +
			'<html>' +
			'<head>' +
				headHtml +
			'</head>' +
			'<body id="' + bodyId + '" class="mce-content-body ' + bodyClass + '"' + dirAttr + '>' +
				editor.getContent() +
			'</body>' +
			'</html>'
		);

		var win = window.open(),
			doc = win.document;
		doc.open();
		doc.write(previewHtml);
		doc.close();
		win.focus();
	}

	editor.addCommand('mcePreview', preview);

	editor.addButton('preview', {
		title : 'Preview',
		cmd : 'mcePreview'
	});

	editor.addMenuItem('preview', {
		text : 'Preview',
		cmd : 'mcePreview',
		context: 'view'
	});
});

