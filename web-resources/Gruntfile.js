module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				mangle : true
			},
			dev : {
				options: {
					sourceMap : true,
					sourceMapIncludeSources : true,
					compress: {
						global_defs: {
							"DEBUG": true
						},
						drop_console: false
					}
				},
				files: [{
					expand: true,
					src:  '*.js',
					dest: '<%= pkg.variable.build_js %>',
					cwd:  '<%= pkg.variable.build_concat_js %>',
					ext: '.min.js',
					extDot: 'first'
				}]
			},
			prod : {
				options: {
					sourceMap : false,
					sourceMapIncludeSources : false,
					compress: {
						global_defs: {
							"DEBUG": false
						},
						drop_console: true
					}
				},
				files: [{
					expand: true,
					src:  '*.js',
					dest: '<%= pkg.variable.build_js %>',
					cwd:  '<%= pkg.variable.build_concat_js %>',
					ext: '.min.js',
					extDot: 'first'
				}]
			}
		},
		concat: {
			js: {
				src: ['<%= pkg.variable.src_js %>/global.js', '<%= pkg.variable.src_js %>/grunt_test.js'],
				dest: '<%= pkg.variable.build_concat_js %>/index.js',
			},
			css: {
				src: ['<%= pkg.variable.src_css %>/global.css', '<%= pkg.variable.src_css %>/grunt_test.css'],
				dest: '<%= pkg.variable.build_concat_css %>/index.css',
			}
		},
		cssmin: {
			target : {
				files: [{
					expand: true,
					cwd: '<%= pkg.variable.build_concat_css %>',
					src: ['*.css'],
					dest: '<%= pkg.variable.build_css %>',
					ext: '.min.css'
				}]
			}
		},
		htmlbuild: {
			dist: {
				src: '<%= pkg.variable.src_root %>/html/index.html',
				dest: '<%= pkg.variable.build_root %>',
				options: {
					sections: {
						templates: '<%= pkg.variable.templates_root %>/*.html'
					}
				}
			}
		}
	});

	// Load the plugin that provides tasks.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-html-build');

	// Default task(s).
	grunt.registerTask('build_dev', ['concat:js','concat:css','uglify:dev','cssmin','htmlbuild']);
	grunt.registerTask('build_recette', ['concat:js','concat:css','uglify:dev','cssmin','htmlbuild']);
	grunt.registerTask('build_prod', ['concat:js','concat:css','uglify:prod','cssmin','htmlbuild']);

};