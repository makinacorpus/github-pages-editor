var gheditor;

(function() {

  var URL = window.webkitURL || window.URL;
  var EXT_ID = "gheditor", TEXTAREA_ID = "__CKEditor_textArea__";

  function save(path, html, comments) {
    var github = new Github({
      username: gheditor.options.account,
      password: gheditor.options.password,
      auth: "basic"
    });
    var repo = github.getRepo(
      gheditor.options.user,
      gheditor.options.repository
      );
    repo.write(
      gheditor.options.branch,
      path,
      html,
      comments,
      function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log("Saved");
        }
      });
  };

  function getPath() {
    var root = gheditor.options.website;
    var current = location.href;
    if(current[current.length - 1]=="/") {
      current += "index.html";
    }
    var path = current.substr(root.length);
    return path;
  }

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
      return {
        title : 'Save HTML file',
        minWidth : 200,
        minHeight : 50,
        contents : [ {
          id: 'tab-basic',
          elements : [ {
            type : 'textarea',
            id : 'comments',
            label : 'Comments',
            validate : CKEDITOR.dialog.validate.notEmpty( 'The Comments field cannot be empty.' ),
            required : true,
            'default' : "Changed from GitHub Pages Editor extension"
          } ]
        } ],
        buttons : [ CKEDITOR.dialog.okButton ],
        onOk : function(e) {
          var html = gheditor.editor.getData();
          var comments = this.getValueOf('tab-basic', 'comments');
          save(getPath(), html, comments)
        }
      };
    }

    function newpagedialog(editor) {
      return {
        title : 'New page',
        minWidth : 200,
        minHeight : 50,
        contents : [ {
          id: 'tab-basic',
          elements : [ {
            type : 'text',
            id : 'filename',
            label : 'Page full path',
            validate : CKEDITOR.dialog.validate.notEmpty( 'The filename cannot be empty.' ),
            required : true,
            'default' : "page.html"
          }, {
            type : 'textarea',
            id : 'comments',
            label : 'Comments',
            validate : CKEDITOR.dialog.validate.notEmpty( 'The Comments field cannot be empty.' ),
            required : true,
            'default' : "Created from GitHub Pages Editor extension"
          }, {
            type : 'file',
            id : 'file',
            label : 'File (leave empty to create an empty HTML page)',
            required : false
          } ]
        } ],
        buttons : [ CKEDITOR.dialog.okButton ],
        onOk : function(e) {
          var self = this;
          var comments = this.getValueOf('tab-basic', 'comments');
          var files = this.getContentElement('tab-basic', 'file').getInputElement().$.files
          if(files.length > 0) {
            var file = files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
              var dataurl = reader.result;
              var content = {
                "content": dataurl.substr(dataurl.indexOf("base64,")+7),
                "encoding": "base64"
              };
              save(self.getValueOf('tab-basic', 'filename'), content, comments);
            }
            reader.readAsDataURL(file);
            
          } else {
            var content = "<html></html>";
            save(this.getValueOf('tab-basic', 'filename'), content, comments);
          }
        }
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
      CKEDITOR.dialog.add('newpageDialog', newpagedialog);
      gheditor = {
        editor : CKEDITOR.replace(TEXTAREA_ID, {
          customConfig : message.configScript
        }),
        options: message.options
      };
      gheditor.editor.setData(pageContent, function() {
        gheditor.editor.addCommand('save', new CKEDITOR.dialogCommand('saveDialog'));
        gheditor.editor.addCommand('newpage', new CKEDITOR.dialogCommand('newpageDialog'));
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
