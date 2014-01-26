var EXT_ID = "gheditor";

var port = chrome.extension.connect();

function toggleEditor(options) {
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", chrome.extension.getURL("scripts/inject_editor.js") + "#" + ("" + Math.random()).split(".")[1]);
	script.addEventListener("load", function() {
		postMessage(EXT_ID + "::" + JSON.stringify({
			toggleEditor : true,
			extensionURI : chrome.extension.getURL(""),
			configScript : chrome.extension.getURL("scripts/ckeditor_config.js"),
			scripts : [ "ckeditor/ckeditor.js", "plugins/codemirror/js/codemirror.js", "plugins/codemirror/plugin.js" ],
			options : options
		}), "*");
	});
	document.head.appendChild(script);
}

port.onMessage.addListener(function(msg) {
	toggleEditor(msg.options);
});

port.postMessage({
	init : true
});