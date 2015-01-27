/**
 * Les Ourses à plumes
 * CKEditor Custom Config
 * http://docs.ckeditor.com/#!/api/CKEDITOR.config
 */

CKEDITOR.editorConfig = function( config ) {

	// Mode
	config.startupMode = "wysiwyg"; // Set startup mode (i.e. "wysiwyg" or "source")

	// Language
	config.defaultLanguage = "fr";

	// Body
	//config.bodyId = "editor"; // Sets the id attribute to be used on the body element of the editing area. This can be useful when you intend to reuse the original CSS file you are using on your live website and want to assign the editor the same ID as the section that will include the contents. In this way ID-specific CSS rules will be enabled.
	//config.bodyClass = "article"; // Sets the class attribute to be used on the body element of the editing area. This can be useful when you intend to reuse the original CSS file you are using on your live website and want to assign the editor the same class as the section that will include the contents. In this way class-specific CSS rules will be enabled.

	// CSS
	config.contentsCss = "css/loap-main.css"; // The CSS file(s) to be used to apply style to editor content. It should reflect the CSS used in the target pages where the content is to be displayed.

	// Autogrow Plugin
	config.autoGrow_onStartup = true; // Whether automatic editor height adjustment brought by the Auto Grow feature should happen on editor creation.
	config.autoGrow_minHeight = 0; // The minimum height that the editor can assume when adjusting to content by using the Auto Grow feature. This option accepts a value in pixels, without the unit (for example: 300).
	config.autoGrow_maxHeight = 0; // The maximum height that the editor can assume when adjusting to content by using the Auto Grow feature. This option accepts a value in pixels, without the unit (for example: 600). Zero (0) means that the maximum height is not limited and the editor will expand infinitely.
	config.autoGrow_bottomSpace = 0; // Extra vertical space to be added between the content and the editor bottom bar when adjusting editor height to content by using the Auto Grow feature. This option accepts a value in pixels, without the unit (for example: 50).

	// Paste
	config.forcePasteAsPlainText = false; // Whether to force all pasting operations to insert on plain text into the editor, loosing any formatting information possibly available in the source text.

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

	// Toolbars
	config.toolbarLocation = "top"; // The part of the user interface where the toolbar will be rendered. For the default editor implementation, the recommended options are "top" and "bottom".
	config.toolbarGroups = [
		{name : "styles"},
		{name : "basicstyles", groups : ["basicstyles", "cleanup"]},
		{name : "links"},
		{name : "insert"},
		{name : "document"},
		{name : "document", groups : ["mode"]},
		{name : "tools"},
	];

	// Buttons and Tabs
	config.removeButtons = "Anchor,Table,HorizontalRule,Format,Subscript,Superscript";
	config.removeDialogTabs = "image:advanced;link:advanced;link:target;";

	// Styles
	config.stylesSet = [
		{name : "Paragraphe", element : "p"},
		{name : "Titre", element : "h4"},
		{name : "Accroche", element : "div", attributes : {"class" : "callout"}},
		{name : "Encadré", element : "p", attributes : {"class" : "panel"}},
		{name : "Incorrect", element : "span", attributes : {"class" : "incorrect"}},
		{name : "Annotation", element : "span", attributes : {"class" : "annotation"}},
	];
};
