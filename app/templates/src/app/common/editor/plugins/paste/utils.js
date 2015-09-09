define(function (require, exports, module) {

'use strict';

/**
 * Utils.js
 *
 * Copyright, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class contails various utility functions for the paste plugin.
 *
 * @class tinymce.pasteplugin.Clipboard
 * @private
 */

/*global tinymce:true */
function filter(content, items) {
	tinymce.each(items, function(v) {
		if (v.constructor == RegExp) {
			content = content.replace(v, '');
		} else {
			content = content.replace(v[0], v[1]);
		}
	});

	return content;
}

	/**
	 * Gets the innerText of the specified element. It will handle edge cases
	 * and works better than textContent on Gecko.
	 *
	 * @param {String} html HTML string to get text from.
	 * @return {String} String of text with line feeds.
	 */
function innerText(html) {
	var schema = new tinymce.html.Schema(), domParser = new tinymce.html.DomParser({}, schema), text = '';
	var shortEndedElements = schema.getShortEndedElements();
	var ignoreElements = tinymce.makeMap('script noscript style textarea video audio iframe object', ' ');
	var blockElements = schema.getBlockElements();

	function walk(node) {
		var name = node.name, currentNode = node;

		if (name === 'br') {
			text += '\n';
			return;
		}

		// img/input/hr
		if (shortEndedElements[name]) {
			text += ' ';
		}

		// Ingore script, video contents
		if (ignoreElements[name]) {
			text += ' ';
			return;
		}

		if (node.type == 3) {
			text += node.value;
		}

		// Walk all children
		if (!node.shortEnded) {
			if ((node = node.firstChild)) {
				do {
					walk(node);
				} while ((node = node.next));
			}
		}

		// Add \n or \n\n for blocks or P
		if (blockElements[name] && currentNode.next) {
			text += '\n';

			if (name == 'p') {
				text += '\n';
			}
		}
	}

	walk(domParser.parse(html));

	return text;
}

return {
	filter: filter,
	innerText: innerText
};

});
