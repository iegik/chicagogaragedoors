module.exports = function (grunt) {

	'use strict';
	var gulp = require('gulp'),
  		styleguide = require('sc5-styleguide');
	
	grunt.util.linefeed = '\n';

	RegExp.quote = function (string) {
		return string.replace(/[\-\\\^$*\+?\.\(\)|\[\]\{\}]/g, '\\$&');
	};

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		meta: {
			defaultPath: 'bootflat'
		},

		banner: '/* Stylesheet for <%= pkg.homepage %>\n\n' +
			'version: <%= pkg.version %>\n' +
			'last modified: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'author: <%= pkg.author %>\n <<%= pkg.email %>>\n' +
			'Licensed under the MIT license. Please see LICENSE for more information.\n' +
			'Copyright <%= grunt.template.today("yyyy") %> © Garage Door Repair professionals.\n' +
			' */\n',

		clean: {
			dist: ['<%= meta.defaultPath %>/css/', 'img/']
		},
		uglify: {
			options: {
				banner: '<%= banner %>',
				sourceMap: true,
				sourceMapIncludeSources: true
			},
			dist: {
				files: {
					'js/site.min.js': [
                        'js/jquery-1.10.1.min.js',
                        'js/bootstrap.min.js',
                        '<%= meta.defaultPath %>/js/icheck.min.js',
                        '<%= meta.defaultPath %>/js/jquery.fs.stepper.min.js',
                        '<%= meta.defaultPath %>/js/jquery.fs.selecter.min.js',
                        'js/application.js'
                    ]
				}
			}
		},
		csscomb: {
			options: {
				config: '<%= meta.defaultPath %>/scss/.csscomb.json'
			},
			dist: {
				files: {
					'<%= meta.defaultPath %>/css/<%= pkg.name %>.css': 'bootflat/css/<%= pkg.name %>.css'
				}
			}
		},
		cssmin: {
			options: {
				keepSpecialComments: 0,
				banner: '<%= banner %>'
			},
			dist: {
				files: {
					'css/site.min.css': [
                        'css/bootstrap.min.css',
                        '<%= meta.defaultPath %>/css/<%= pkg.name %>.css',
                        'css/site.css'
                    ],
					'<%= meta.defaultPath %>/css/<%= pkg.name %>.min.css': '<%= meta.defaultPath %>/css/<%= pkg.name %>.css'
				}
			}
		},
		sass: {
			dist: {
				files: {
					'<%= meta.defaultPath %>/css/<%= pkg.name %>.css': '<%= meta.defaultPath %>/scss/<%= pkg.name %>.scss'
				},
				options: {
					/*banner: '<%= banner %>',*/
					style: 'expanded'
						/*sourcemap: 'true'*/
				}
			}
		},
		csslint: {
			options: {
				csslintrc: '<%= meta.defaultPath %>/scss/.csslintrc'
			},
			src: ['<%= meta.defaultPath %>/css/<%= pkg.name %>.css']
		},
		validation: {
			options: {
				charset: 'utf-8',
				doctype: 'HTML5',
				failHard: true,
				reset: true,
				relaxerror: [
                    'Bad value apple-mobile-web-app-title for attribute name on element meta: Keyword apple-mobile-web-app-title is not registered.',
                    'Bad value apple-mobile-web-app-status-bar-style for attribute name on element meta: Keyword apple-mobile-web-app-status-bar-style is not registered.',
                    'Bad value X-UA-Compatible for attribute http-equiv on element meta.',
                    'Attribute ontouchstart not allowed on element body at this point.'
                ]
			},
			files: {
				src: '*.html'
			}
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: false,
					collapseWhitespace: true,
					removeEmptyAttributes: true,
					removeCommentsFromCDATA: true,
					removeRedundantAttributes: true,
					collapseBooleanAttributes: true,
					jsmin: true
				},
				files: {
					// Destination : Source
					'./index.html': './htmlmin/index.html'
				}
			}
		},
		jshint: {
			/*
			    Note:
			    In case there is a /release/ directory found, we don't want to lint that
			    so we use the ! (bang) operator to ignore the specified directory
			*/
			files: ['Gruntfile.js', 'js/application.js'],
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true,

				globals: {
					// AMD
					module: true,
					require: true,
					requirejs: true,
					define: true,

					// Environments
					console: true,

					// General Purpose Libraries
					$: true,
					jQuery: true,

					// Testing
					sinon: true,
					describe: true,
					it: true,
					expect: true,
					beforeEach: true,
					afterEach: true
				}
			}
		},
		imagemin: {
			png: {
				options: {
					optimizationLevel: 7
				},
				files: [
					{
						expand: true,
						cwd: './images/',
						src: ['**/*.png'],
						dest: './img/',
						ext: '.png'
                    }
                ]
			},
			gif: {
				options: {
					optimizationLevel: 3
				},
				files: [
					{
						expand: true,
						cwd: './images/',
						src: ['**/*.gif'],
						dest: './img/',
						ext: '.gif'
                    }
                ]
			},
			jpg: {
				options: {
					progressive: true
				},
				files: [
					{
						expand: true,
						cwd: './images/',
						src: ['**/*.jpg'],
						dest: './img/',
						ext: '.jpg'
                    }
                ]
			}
		},
		sed: {
			versionNumber: {
				pattern: (function () {
					var old = grunt.option('oldver');
					return old ? RegExp.quote(old) : old;
				}()),
				replacement: grunt.option('newver'),
				recursive: true
			}
		},
		appcache: {
			options: {
				// Task-specific options go here. 
			},
			all: {
				dest: 'manifest.appcache.txt',
				cache: {
					patterns: [
                        'img/**/*.webp',
                        'img/**/*.ico',
                        'css/site.min.css',
                        'js/site.min.js'
                    ]
				},
				network: '*',
				fallback: '/'
			}
		},
		sitemap: {
			dist: {
				pattern: ['index.html'],
				siteRoot: './'
			}
		},
		gulp: {
			'styleguide-generate': function () {
				var outputPath = 'styleguide';
				return gulp.src(['<%= meta.defaultPath %>/scss/<%= pkg.name %>.scss'])
					.pipe(styleguide.generate({
						title: 'My Styleguide',
						server: true,
						rootPath: outputPath
					}))
					.pipe(gulp.dest(outputPath));
			},
			'styleguide-applystyles': function () {
				gulp.src('<%= meta.defaultPath %>/scss/<%= pkg.name %>.scss')
					.pipe(styleguide.applyStyles())
					.pipe(gulp.dest('styleguide'));
			},
			watch: {
				scss: {
					files: ['<%= meta.defaultPath %>/scss/<%= pkg.name %>.scss','index.html'],
					tasks: ['task-css', 'gulp:styleguide-generate', 'gulp:styleguide-applystyles', 'task-html']
				}
			}
		},
	});

	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	grunt.registerTask('task-css', ['sass', 'csscomb', 'cssmin', 'appcache']);
	grunt.registerTask('task-styleguide', ['gulp:styleguide-generate', 'gulp:styleguide-applystyles']);
	grunt.registerTask('task-html', ['htmlmin', 'sitemap', 'appcache']);
	grunt.registerTask('task-js', ['uglify', 'appcache']);
	grunt.registerTask('task-imagemin', ['imagemin', 'appcache']);
	grunt.registerTask('task-appcache', ['appcache']);
	grunt.registerTask('task-sitemap', ['sitemap']);

	grunt.registerTask('task', ['clean', 'task-css', 'task-js', 'task-imagemin', 'appcache']);
	grunt.registerTask('build', ['task', 'task-styleguide']);
	grunt.registerTask('default', ['task']);
	grunt.registerTask('watch', ['gulp:watch']);
	grunt.registerTask('check-call', ['csslint', 'validation', 'jshint']);
	grunt.registerTask('check-css', ['csslint']);
	grunt.registerTask('check-html', ['validation']);
	grunt.registerTask('check-js', ['jshint']);

	// Version numbering task.
	// grunt change-version-number --oldver=A.B.C --newver=X.Y.Z
	// This can be overzealous, so its changes should always be manually reviewed!
	grunt.registerTask('change-version-number', 'sed');
};