/**
 * Les Ourses à plumes
 * CKEditor Custom Config
 * http://docs.ckeditor.com/#!/api/CKEDITOR.config
 * ver. 0.0.7
 */

CKEDITOR.editorConfig = function( config ) {

	// Plugins -- http://ckeditor.com/addon/xxxxxx
	config.extraPlugins = "autogrow,youtube"; // Autosize Editor on line feed
	config.removePlugins = ""
	// + "dialogui," // This plugin defines various dialog field types to be used in the dialog, which is mostly used in accompany with the dialog plugin.
	// + "dialog," // This plugin provides the dialog API for other plugins to build an editor dialog from a definition object.
	// + "a11yhelp," // Accessibility Help. Alt+0 is assigned as the default keyboard shortcut for this dialog window.
	+ "about," // This core plugin displays CKEditor version, online documentation links, and licensing information.
	+ "basicstyles," // This plugin adds the following basic formatting commands to the editor.
	+ "blockquote," // This plugin provides the feature of block-level quotation (HTML <blockquote> tag) in contents.
	// + "clipboard," // This plugin handles cut/copy/paste inside of the editor, processed the clipboard content on pasting, makes it better fit in the editor context, or even stripped it down into plain text. It opens a dialog when the pasting meets browser security constraints.
	// + "panel," // This plugin used along with the floatpanel plugin is to provide the basis of all editor UI panels - dropdown, menus, etc.
	// + "floatpanel," // This plugin along with the panel plugin is to provide the basis of all editor UI panels - dropdown, menus, etc.
	// + "menu," // Plugin containing methods for building CKEditor menus (e.g. context menu or drop down menu).
	+ "contextmenu," // The plugin provides the editor's context menu to use instead of the browser's native menu in place. It also provides the API to manage menu item and group. With the presence of this plugin, the native context menu will still be available when Ctrl key is pressed when opening the menu which can be configured as well.
	+ "resize," // This plugin allows you to resize the themedui editor instance by dragging the lower-right (or left in right-to-left mode) corner of the editor. It can be configured to make editor resizable only in one direction (horizontally, vertically) or in both.
	// + "button," // This plugin provides an UI button component that other plugins use to register buttons on editor toolbar and menu, it's not providing any concrete editor feature.
	// + "toolbar," // This plugin provides the classical experience to access editor commands, including items like buttons and combos.
	+ "elementspath," // This plugin displays a list of HTML element names in the current cursor position. By default the list appears at the bottom of the editor interface and can give the users contextual information about the content that they are creating. Clicking an element name on the Elements Path selects the element in the editor content.
	// + "enterkey," // This plugin defines the Enter key (line breaking) behavior in all different contexts, depends on the configuration, editor will present the line break in one of the following ways: 1) paragraph block 2) div block 3) BR element. Shift-Enter key behavior can also be defined in compensate of the enter key in similiar way.
	// + "entities," // This plugin escapes HTML entities that appear in the editor output based on configuration.
	// + "popup," // This plugin adds a tool function to open pages in popup windows.
	// + "filebrowser," // This plugin is to integrate the editor with external file browse/upload application, it defines the protocol to associate with any dialog field that has a filebrowser property in dialog definition, to any file manager application.
	// + "floatingspace," // This plugin is used in inline creator to place the editor toolbar in the best position around the editable element.
	// + "listblock," // This plugin proThis plugin provides main class including a set of methods used for constructing dropdowns like Styles, Format, Font Size, etc.vides the basis for constructing a drop down list in editor float panels, mostly found inside of the rich combo, list item with label and value can be grouped into a section.
	// + "richcombo," // This plugin provides main class including a set of methods used for constructing dropdowns like Styles, Format, Font Size, etc.
	+ "format," // This plugin adds Format combo allows you to apply block-level format styles including "paragraph", "heading 1-6", "formatted", "address", etc. Format styles list is fully configurable.
	+ "horizontalrule," // This plugin provides the command to insert Horizontal Rule (<hr> element) in content.
	// + "htmlwriter," // This plugin provides flexible HTML output formatting, with several configuration options to control the editor output format.
	// + "wysiwygarea," // This plugin represents an editing area that holds the editor contents inside of an embedded iframe, so that styles of the content are not inherited from the host page.
	// + "image," // This plugin add the following image oriented feature to editor: 1) Insert image with all properties managed in a dialog, 2) Integrate with any external file manager to upload/browser images, 3) Context menu option to edit an existing image
	+ "indent," // This plugin adds the generic Increase/Decrease Indent commands and toolbar buttons to the editor. These commands can be used to change the indentation of text blocks as well as list indentation levels.
	+ "indentlist," // This plugin handles list indentation (for <ul> and <ol> elements). It allows to change list indentation levels by nesting lists (indent) or changing them into paragraphs (outdent). This plugin introduces keyboard shortcuts for indenting and outdenting lists by using the Tab and Shift+Tab keys, respectively.
	// + "fakeobjects," // This plugin helps to create a "representative" (image with styles) for certain elements which have problem with living in editable, it provides the API to transform an real DOM element into the "fake" one, and to restore the real element from the fake one on the output.
	// + "link," // This plugin adds the following features regard link and anchor:The dialog to insert link and anchor with properties, Link with URL in multiple protocols, including external file if a file manager is integrated, Context menu option to edit or remove link
	+ "list," // With this plugin it is possible to insert and remove numbered and bulleted lists in the editor.
	// + "magicline," // This plugin makes it easier to place cursor and add content near some problematic document elements like, for example, images, tables or <div> elements that start or end a document, lists, or even adjacent horizontal lines.
	// + "maximize," // This plugin adds toolbar button maximizing the editor inside a browser window. After just one click you will feel like desktop word processor user.
	+ "pastetext," // With this plugin it is possible to have the clipboard data to be always pasted as plain text, with two options: 1) Define a configuration to force the plain text paste 2) Toolbar button to paste once in plain text
	+ "pastefromword," // With this plugin it is possible to paste content from MS Word while maintaining original formatting. It also adds Paste from Word toolbar button which makes it possible to paste clipboard data this way only on demand.
	+ "removeformat," // This plugin adds toolbar button which makes it possible to remove all text styling (bold, font color, etc.) applied to selected part of the document. The result is a plain text.
	// + "sourcearea," // This plugin adds the source editing mode to CKEditor. It allows you to modify the editor output in the HTML format.
	// + "specialchar," // With this plugin it is possible to insert characters that are not part of the standard keyboard.
	// + "menubutton," // This plugin provides a menu button UI component when clicked opens a drop-down menu with a list of options.
	+ "scayt," // This plugin brings Spell Check As You Type (SCAYT) into CKEditor. SCAYT is "installation-less", using the web-services of WebSpellChecker.net. It's an out of the box solution.
	// + "stylescombo," // This plugin provides a rich combo on toolbar that opens with a list of styles defined in the styles.js file contains various formatting options that apply to block, inline and object elements, and it can be customized.
	+ "tab," // This plugin provides basic Tab/Shift-Tab key handling with the following behaviors: 1) Move to next/previous table cell, if within a table 2) Move to next editor instance in page, otherwise
	+ "table," // This plugin allows to create and manage a table with a dialog.
	+ "tabletools," // This plugin offers column/row/cell manipulation on HTML tables all from within the context menu.
	// + "undo," // This plugin is to provide undo and redo feature to content modifications.
	// + "wsc" // This plugin brings WebSpellChecker into CKEditor. WebSpellChecker is "installation-less", using the web-services of WebSpellChecker.net. It's an out of the box solution.

	// Mode
	config.startupMode = "wysiwyg"; // Set startup mode (i.e. "wysiwyg" or "source")

	// Language
	config.defaultLanguage = "fr";

	// Body
	//config.bodyId = "editor"; // Sets the id attribute to be used on the body element of the editing area. This can be useful when you intend to reuse the original CSS file you are using on your live website and want to assign the editor the same ID as the section that will include the contents. In this way ID-specific CSS rules will be enabled.
	//config.bodyClass = "article"; // Sets the class attribute to be used on the body element of the editing area. This can be useful when you intend to reuse the original CSS file you are using on your live website and want to assign the editor the same class as the section that will include the contents. In this way class-specific CSS rules will be enabled.

	// CSS
	// config.contentsCss = "css/loap-main.css"; // The CSS file(s) to be used to apply style to editor content. It should reflect the CSS used in the target pages where the content is to be displayed.

	// Autogrow Plugin
	config.autoGrow_onStartup = true; // Whether automatic editor height adjustment brought by the Auto Grow feature should happen on editor creation.
	config.autoGrow_minHeight = 0; // The minimum height that the editor can assume when adjusting to content by using the Auto Grow feature. This option accepts a value in pixels, without the unit (for example: 300).
	config.autoGrow_maxHeight = 0; // The maximum height that the editor can assume when adjusting to content by using the Auto Grow feature. This option accepts a value in pixels, without the unit (for example: 600). Zero (0) means that the maximum height is not limited and the editor will expand infinitely.
	config.autoGrow_bottomSpace = 24; // Extra vertical space to be added between the content and the editor bottom bar when adjusting editor height to content by using the Auto Grow feature. This option accepts a value in pixels, without the unit (for example: 50).

	// Paste
	config.forcePasteAsPlainText = false; // Whether to force all pasting operations to insert on plain text into the editor, loosing any formatting information possibly available in the source text.

	// Format
	config.removeFormatAttributes = "style,lang,width,height,align,hspace,valign"; // A comma separated list of elements attributes to be removed when executing the remove format command.
	config.removeFormatTags = "b,big,code,del,dfn,em,font,i,ins,kbd,q,s,samp,small,span,strike,strong,sub,sup,tt,u,var"; // A comma separated list of elements to be removed when executing the remove format command. Note that only inline elements are allowed.

	// Special Chars
	config.specialChars = [ // The list of special characters visible in the 'Special Character' dialog window.
		["&#160;", "Espace insécable"],
		["&#8201;", "Espace fin"],
		["&#8239;", "Espace fin insécable"],
		["&#133;", "Points de suspension"],
		["&#8220;", "Guillemet double gauche"],
		["&#8221;", "Guillemet double droit"],
		["&#171;", "Guillemet typographique gauche"],
		["&#187;", "Guillemet typographique droit"],
		["&#8211;", "Tiret moyen"],
		["&#8212;", "Tiret long"],
		["&#167;", "Paragraphe"],
		["&#182;", "Pied de mouche"],
		["&#8252;", "Double point d'exclamation"],
		["&#169;", "Copyright"],
		["&#174;", "Marque déposée"],
		["&#156;", "O-E ligaturés minuscules"],
		["&#140;", "O-E ligaturé majuscules"],
		["&#192;", "A accent grave majuscule"],
		["&#199;", "C cédille majuscule"],
		["&#200;", "E accent grave majuscule"],
		["&#201;", "E accent aigu majuscule"],
		["&#202;", "E accent circonflexe majuscule"],
		["&#203;", "E tréma majuscule"],
		["&#177;", "Plus ou moins"],
		["&#215;", "Fois"],
		["&#8730;", "Racine carrée"],
		["&#8776;", "Presque égal"],
		["&#137;", "Pour mille"],
		["&#188;", "Fraction un quart"],
		["&#189;", "Fraction un demi"],
		["&#190;", "Fraction trois-quarts"],
		["&#134;", "Obèle"],
		["&#135;", "Double obèle"],
		["&#9792;", "Signe féminin"],
		["&#9794;", "Signe masculin"],
		["&#8593;", "Flèche vers le haut"],
		["&#8595;", "Flèche vers le bas"],
		["&#8592;", "Flèche vers la gauche"],
		["&#8594;", "Flèche vers la droite"],
		["&#149;", "Balle"],
		["&#9674;", "Losange"],
		["&#9675;", "Cercle"],
		["&#9632;", "Carré"],
		["&#9650;", "Triangle vers le haut"],
		["&#9660;", "Triangle vers le bas"],
		["&#9668;", "Triangle vers la gauche"],
		["&#9658;", "Triangle vers la droite"],
		["&#9829;", "Cœur"],
		["&#9830;", "Carreau"],
		["&#9827;", "Trèfle"],
		["&#9824;", "Pique"]
	];

	/*
	// Toolbar configuration generated automatically by the editor based on config.toolbarGroups.
	config.toolbar = [
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates' ] },
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ], items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker' ], items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
		{ name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
		{ name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
		{ name: 'insert', items: [ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] },
		'/',
		{ name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
		{ name: 'colors', items: [ 'TextColor', 'BGColor' ] },
		{ name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] },
		{ name: 'others', items: [ '-' ] },
		{ name: 'about', items: [ 'About' ] }
	];

	// Toolbar groups configuration.
	config.toolbarGroups = [
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker' ] },
		{ name: 'forms' },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
		{ name: 'links' },
		{ name: 'insert' },
		'/',
		{ name: 'styles' },
		{ name: 'colors' },
		{ name: 'tools' },
		{ name: 'others' },
		{ name: 'about' }
	];
	config.format_tags = 'p;h1;h2;h3;pre';
	*/

	// Toolbars
	config.toolbarLocation = "top"; // The part of the user interface where the toolbar will be rendered. For the default editor implementation, the recommended options are "top" and "bottom".
	config.toolbarGroups = [
		{name : "styles"},
		{name : "links"},
		{name : "insert"},
		{name : "document"},
		{name : "document", groups : ["mode"]},
		{name : "tools"},
	];
	config.removeButtons = "Anchor,Table,HorizontalRule,Format";
	config.removeDialogTabs = "image:advanced;link:advanced;link:target;";

	// Styles
	config.stylesSet = [
		{name : "Titre", element : "h4", attributes : {"class" : ""}},
		{name : "Accroche", element : "div", attributes : {"class" : "callout"}},
		{name : "Paragraphe", element : "p", attributes : {"class" : ""}}
	];
};
