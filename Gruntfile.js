module.exports = function(grunt) {

	grunt.initConfig({

		// Import package manifest
		pkg: grunt.file.readJSON("menuclipper.jquery.json"),

		clean : ['dist'],

		// Watch for CSS changes
		watch : {
			css : {
				files : "src/jquery.menuclipper.css",
				tasks : 'copy:css'
			},
			js : {
				files : "src/jquery.menuclipper.js",
				tasks : 'concat'
			}
		},

		// Banner definitions
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.homepage %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.licenses[0].type %> License\n" +
				" */\n"
		},

		// Concat definitions
		concat: {
			dist: {
				src: ["src/jquery.menuclipper.js"],
				dest: "dist/jquery.menuclipper.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		// Lint definitions
		jshint: {
			files: ["src/jquery.menuclipper.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Minify definitions
		uglify: {
			my_target: {
				src: ["dist/jquery.menuclipper.js"],
				dest: "dist/jquery.menuclipper.min.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		// Copy files
		copy:{
			css : {
				src : 'src/jquery.menuclipper.css',
				dest : 'dist/jquery.menuclipper.css'
			},
			js : {
				src : 'src/jquery.actual.min.js',
				dest : 'dist/jquery.actual.min.js'
			},
		}

	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-coffee");
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');

	//grunt.registerTask("default", ["jshint", "concat", "uglify", "copy"]);
	grunt.registerTask("default", ["clean", "concat", "uglify", "copy"]);
	grunt.registerTask("travis", ["jshint"]);

};
