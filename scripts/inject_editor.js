var gheditor;

(function() {

	var URL = window.webkitURL || window.URL;
	var EXT_ID = "gheditor", TEXTAREA_ID = "__CKEditor_textArea__";

	function getDoctype() {
		var docType = document.doctype, docTypeStr;
		if (docType) {
			docTypeStr = "<!DOCTYPE " + docType.nodeName;
			if (docType.publicId) {
				docTypeStr += " PUBLIC \"" + docType.publicId + "\"";
				if (docType.systemId)
					docTypeStr += " \"" + docType.systemId + "\"";
			} else if (docType.systemId)
				docTypeStr += " SYSTEM \"" + docType.systemId + "\"";
			if (docType.internalSubset)
				docTypeStr += " [" + docType.internalSubset + "]";
			return docTypeStr + ">\n";
		}
		return "";
	}

	function onMessage(message) {
		var i, pageContent, title = document.title;

		function savedialog(editor) {
			var link = document.createElement("a"), BOM = new ArrayBuffer(3), v = new Uint8Array(BOM);
			v.set([ 0xEF, 0xBB, 0xBF ]);
			link.href = URL.createObjectURL(new Blob([ BOM, editor.getData() ]));
			link.download = (location.pathname.split("/").pop() || "Unnamed page.html");
			link.innerHTML = "Download the page";
			link.style.textDecoration = "underline";
			return {
				title : 'Save HTML file',
				minWidth : 200,
				minHeight : 50,
				contents : [ {
					elements : [ {
						type : 'html',
						html : link.outerHTML
					} ]
				} ],
				buttons : [ CKEDITOR.dialog.okButton ]
			};
		}

		function onload() {
			var form, textarea;
			document.removeEventListener("load", onload, true);
			form = document.createElement("form");
			textarea = document.createElement("textarea");
			textarea.style.display = "none";
			textarea.setAttribute("id", TEXTAREA_ID);
			form.appendChild(textarea);
			document.body.appendChild(form);

			CKEDITOR.config.skin = message.options.skin;
			CKEDITOR.config.toolbar = message.options.toolbar;
			CKEDITOR.dialog.add('saveDialog', savedialog);
			gheditor = {
				editor : CKEDITOR.replace(TEXTAREA_ID, {
					customConfig : message.configScript
				})
			};
			gheditor.editor.setData(pageContent, function() {
				gheditor.editor.addCommand('save', new CKEDITOR.dialogCommand('saveDialog'));
				gheditor.editor.execCommand("maximize");
			});
		}

		if (message.toggleEditor) {
			if (gheditor && gheditor.editor) {
				var data = gheditor.editor.getData();
				CKEDITOR.remove(gheditor.editor);
				delete CKEDITOR;
				delete gheditor.editor;
				document.open();
				document.write(data);
				document.close();
			} else {
				pageContent = getDoctype() + document.documentElement.outerHTML;
				document.open();
				document.addEventListener("load", onload, true);
				document.writeln("<!DOCTYPE html>");
				document.write("<html>");
				document.write("<head>");
				document.write("<title>");
				document.write(title);
				document.write("</title>");
				document.write("</head>");
				document.write("<body>");
				for (i = 0; i < message.scripts.length; i++)
					document.write("<script type='text/javascript' src='" + message.extensionURI + message.scripts[i] + "?"
							+ ("" + Math.random()).split(".")[1] + "'></script>");
				document.write("</body>");
				document.write("</html>");
				document.close();
			}
		}
	}

	function addMessageListener() {
		addEventListener("message", function windowMessageListener(event) {
			var data = event.data;
			if (data.indexOf(EXT_ID + '::') == 0)
				onMessage(JSON.parse(data.substr(EXT_ID.length + 2)));
		}, false);
	}

	document.head.removeChild(document.head.childNodes[document.head.childNodes.length - 1]);

	addMessageListener();
})();
