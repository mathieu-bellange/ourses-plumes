/* ------------------------------------------------------------------ */
/* # Temporary */
/* ------------------------------------------------------------------ */

var db_rubrique = [
	{"id" : 1, "classe" : "struggles"},
	{"id" : 2, "classe" : "ourbody"},
	{"id" : 3, "classe" : "intersec"},
	{"id" : 4, "classe" : "internat"},
	{"id" : 5, "classe" : "educult"},
	{"id" : 6, "classe" : "ideas"}
];

var db_article = [
	{"id" : 6, "title" : "Avortement : un droit mal acquis", "rubrique_id" : 4, "path" : "javascript:void(0)"},
	{"id" : 13, "title" : "La guerre des poupons", "rubrique_id" : 3, "path" : "javascript:void(0)"},
	{"id" : 22, "title" : "Le troisième sexe", "rubrique_id" : 1, "path" : "javascript:void(0)"},
	{"id" : 43, "title" : "Parité : une théorie éculée ?", "rubrique_id" : 2, "path" : "javascript:void(0)"},
	{"id" : 927, "title" : "Gestation pour autrui, une autre étape ?", "rubrique_id" : 1, "path" : "javascript:void(0)"}
];

var db_folder = [
	{"id" : 7, "hash" : "natalite", "name" : "Natalité", "desc" : "<p>Le dossier qui regroupe les sujets sur la natalité.</p>", "list" : "{'1' : 13, '2' : 6, '0' : 927}"},
	{"id" : 1, "hash" : "egalite-des-sexes", "name" : "Égalité des sexes", "desc" : "<p>Le dossier qui regroupe les sujets sur l'égalité des sexes.</p>", "list" : "{'0' : 22, '1' : 43}"},
	{"id" : 11, "hash" : "evenements", "name" : "Évènements", "desc" : "<p>Le dossier qui regroupe les sujets sur des évènements.</p>"}
];

/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"folder_view_mptl" : $loc.tmpl + "folder-view.mptl"
}

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			/* Set page title */
			set_page_title($nav.folder_view.title);
			/* Insert template */
			folder_list.build($(".main-body"), file_pool.folder_view_list_tmpl(db_folder), db_article, db_rubrique); // process build view
			/* Initialize component */
			folder_list.init(); // init component
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

// Domain stuff here

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

// AJAX things here

/* ------------------------------------------------------------------ */
/* # Live Events */
/* ------------------------------------------------------------------ */

// Live events here
