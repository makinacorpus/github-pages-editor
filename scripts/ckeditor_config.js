CKEDITOR.editorConfig = function(config) {
	config.toolbar_CustomFull = [ [ 'Source', '-', 'Save', 'NewPage', 'DocProps', 'Preview', '-', 'Templates', 'Print' ],
			[ 'Undo', 'Redo', '-', 'Find', 'Replace', '-', 'SelectAll', 'RemoveFormat' ],
			[ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ],
			[ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak' ], '/',
			[ 'Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript' ],
			[ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'Blockquote' ], [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ],
			[ 'Link', 'Unlink', 'Anchor' ], [ 'Styles', 'Format', 'Font', 'FontSize' ], [ 'TextColor', 'BGColor' ], [ 'ShowBlocks' ] ];

	config.toolbar_CustomBasic = [ [ 'Source', '-', 'Save', 'NewPage', 'DocProps', 'Preview', '-', 'Templates' ],
			[ 'Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript' ], [ 'NumberedList', 'BulletedList' ],
			[ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ], [ 'Link', 'Unlink', 'Anchor' ], [ 'Styles', 'Format', 'Font', 'FontSize' ],
			[ 'TextColor', 'BGColor' ], [ 'ShowBlocks' ] ];

	config.fullPage = true;
	config.startupFocus = true;
	CKEDITOR.config.extraPlugins = "codemirrorarea,tableresize,docprops,stylesheetparser";
};
