/**
doT.templateSettings = {
	evaluate: regexp,      // parse a string as a javascript instruction WITHOUT appending it to the result function (mostly used for statements)
	interpolate: regexp,   // parse a string as a javascript instruction and append it to the result function (n.b. this is default behaviour)
	encode: regexp,        // replace illegal characters by html numeric entities
	use: regexp,           // call partial template
	define: regexp,        // set partial template
	conditional: regexp,   // execute 'if, else if, else' structure
	iterate: regexp,       // loop an array
	varname: string,       // define the name of result function argument (i.e. the variable used for templating)
	strip: boolean,        // erase whitespaces in result output (including tabulations and line breaks -- minify/compress)
	append: boolean,       // define concatenated output result in a single line variable (i.e. use '+' operand instead of '+=' operand for 'out' var)
	selfcontained: boolean // include 'encodeHTML' function in result function (i.e. result function should not depend on doT.js that way)
};
*/

doT.templateSettings.varname = 'data';
doT.templateSettings.strip = false;