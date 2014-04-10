/**
 * Les Ourses à plumes
 * Javascript File for test.html
 * Require boot, core and build
 * ver. 0.0.2
 */

/* ------------------------------------------------------------------ */
/* # Build */
/* ------------------------------------------------------------------ */

var test_data = JSON.parse(loadfile($app_root + "json/dev_templating.json")), // define data
    test_template = loadfile($app_root + "tmpl/dev_templating.tmpl"), // define template
    test_compile = doT.compile(test_template); // compile template
$("section#dev_templating").append(test_compile(test_data)); // apply compiled data to DOM
// console.log("test_data = " + test_data + "\ntest_template = " + test_template + "\ntest_compile = " + test_compile + "\nresult = " + test_compile(test_data)); // DEBUG

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
