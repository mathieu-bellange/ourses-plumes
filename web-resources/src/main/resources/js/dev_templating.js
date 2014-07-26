/* ------------------------------------------------------------------ */
/* # Templating */
/* ------------------------------------------------------------------ */

var test_data = JSON.parse(loadfile($app_root + "json/dev_templating.json")), // define data
		test_template = loadfile($app_root + "tmpl/dev_templating.tmpl"), // define template
		test_compile = doT.compile(test_template); // compile template
$("header").after(test_compile(test_data)); // apply compiled data to DOM

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

// Domain stuff goes here

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

// AJAX stuff goes here

/* ------------------------------------------------------------------ */
/* # Events */
/* ------------------------------------------------------------------ */

// jQuery events go here
