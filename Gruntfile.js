module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // App configurations
    meta: {
      title: 'mochasprouts',
      environment: 'dev',

      dist: 'dist',
      env: 'env/<%= meta.environment %>',
      tmp: 'tmp',
      test: 'test',
  
      src: {
        base: 'src',
        js: '<%= meta.src.base %>/js',
        css: '<%= meta.src.base %>/css',
        img: '<%= meta.src.base %>/img',
        templates: '<%= meta.src.base %>/templates'
      },

      lib: {
        base: 'lib',
        js: '<%= meta.lib.base %>/js',
        css: '<%= meta.lib.base %>/css',
        img: '<%= meta.lib.base %>/img'
      },

      build: {
        base: '<%= meta.tmp %>/build',
        img: '<%= meta.build.base %>/img',
        html: '<%= meta.build.base %>/index.html',
        css: '<%= meta.build.base %>/css/app.css',
        app: '<%= meta.build.base %>/js/app.js',
        lib: '<%= meta.build.base %>/js/lib.js',
        tests: '<%= meta.build.base %>/js/tests.js',
        templates: '<%= meta.build.base %>/js/templates.js'
      }
    },

    // Run time environment modifications
    config: {
      dev: {
        options: {
          variables: {
          }
        }
      },
      test: {
        options: {
          variables: {
            'meta.environment': 'prod'
          }
        }
      },
      prod: {
        options: {
          variables: {
            'meta.environment': 'prod'
          }
        }
      }
    },
    

    // Build tasks
    fabricate: {
      app: {
        src: '<%= meta.src.js %>/bootstrap.js',
        dest: '<%= meta.build.app %>',
        include: ['<%= meta.env %>'],
        tmpDir: '<%= meta.tmp %>/fabricate'
      },
      lib: {
        src: '<%= meta.src.js %>/lib.js',
        dest: '<%= meta.build.lib %>',
        include: ['<%= meta.env %>', '<%= meta.lib.js %>'],
        tmpDir: '<%= meta.tmp %>/fabricate'
      },
      tests: {
        src: '<%= meta.test %>/runner.js',
        dest: '<%= meta.build.tests %>',
        include: ['<%= meta.test %>'],
        tmpDir: '<%= meta.tmp %>/fabricate'
      }
    },

    emberTemplates: {
      compile: {
        options: {
          templateName: function(sourceFile) {
            return sourceFile.replace(/src\/templates\//, '');
          }
        },
        files: {
          '<%= meta.build.templates %>': '<%= meta.src.templates %>/**/*.hbs'
        }
      }
    },

    sass: {
      build: {
        options: {
          style: 'expanded',
          quiet: true,
          cacheLocation: '<%= meta.tmp %>/cache',
          loadPath: [
            '<%= meta.src.css %>',
            '<%= meta.env %>',
            '<%= meta.lib.css %>'
          ]
        },
        files: {
          '<%= meta.build.css %>': '<%= meta.src.css %>/application.scss',
        }
      }
    },

    consolidate: {
      index: {
        options: {
          engine: 'ejs',
          local: {
            title:   '<%= meta.env %>',
            styles:  ['css/app.css'],
            scripts: ['js/lib.js', 'js/templates.js', 'js/app.js']
          }
        },
        src: '<%= meta.src.base %>/index.ejs',
        dest: '<%= meta.build.html %>',
      }
    },


    // Delivery
    chauffeur: {
      dev: {
        port: 8000,
        // routes: 'routes.js',
        staticFiles: [
          '<%= meta.build.base %>',
          '<%= meta.test %>',
          '<%= meta.tmp %>/fabricate'
        ],
        lockfile: 'tmp/chauffeur.lock',
        testable: {
          route: 'test.html',
          files: [
            '<%= meta.build.css %>',
            '<%= meta.test %>/lib/ember_testing_ui.css',
            '<%= meta.build.lib %>',
            '<%= meta.build.templates %>',
            '<%= meta.build.app %>',
          ],
          tests: [
            '<%= meta.build.tests %>',
          ],
          transformPath: function(pathName) {
            if (new RegExp('^test').test(pathName)) {
              pathName = pathName.replace('test/', '');
            }
            if (new RegExp('^tmp/build').test(pathName)) {
              pathName = pathName.replace('tmp/build/', '');
            }
            return pathName;
          }
        },
        proxy: [
          { port: 3001 }
        ]
      }
    },

    gatekeeper: {
      dev: {
        api: {
          config: 'config/dev/api.gatekeeper.json',
          noCSRF: true
        },
      },
    },
    

    // Optimizations
    uglify: {
      app: {
        src:  '<%= meta.build.app %>',
        dest: '<%= meta.build.app %>'
      },
      templates: {
        src:  '<%= meta.build.templates %>',
        dest: '<%= meta.build.templates %>'
      }
    },

    cssmin: {
      app: {
        src: '<%= meta.build.css %>',
        dest: '<%= meta.build.css %>'
      }
    },

    imagemin: {
      prod: {
        options: {
          optimizationLevel: 3
        },
        src: '<%= meta.build.img %>/**/*',
        dest: '<%= meta.build.img %>'
      }
    },

    // compress: {
    //   build: {
    //     options: {
    //       archive: '<%= meta.archive %>',
    //       mode: 'tgz'
    //     },
    //     files: [
    //       { expand: true, cwd: '<%= meta.tmp %>', src: 'build/**' }
    //     ]
    //   }
    // },

   
    // Utility
    copy: {
      img: {
        files: [{
          expand: true,
          cwd: '<%= meta.src.img %>/',
          src: ['**/*.*'],
          dest: '<%= meta.build.img %>/',
        },{
          expand: true,
          cwd: '<%= meta.lib.img %>/',
          src: ['**/*.*'],
          dest: '<%= meta.build.img %>/'
        }]
      },
    },

    clean: {
      build: '<%= meta.build.base %>/*',
      dist: '<%= meta.dist %>/*',
      fabricate: '<%= meta.tmp %>/fabricate'
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true,
          $: true,
          Ember: true,
          Em: true,
          Blocks: true
        },
        '-W018': true, // Ignore "Confusing use of '!'"
      },
      dev: {
        src: '<%= meta.src.js %>/**/*.js'
      },
      build: {
        src: '<%= meta.dest.app %>'
      }
    },

    watch: {
      app: {
        files: ['<%= meta.src.js %>/**/*.js', '!<%= meta.src.js %>/libraries.js'],
        tasks: ['lock', 'config:dev', 'fabricate:app', 'unlock']
      },
      lib: {
        files: ['<%= meta.src.js %>/libraries.js', '<%= meta.lib.js %>/**/*.js'],
        tasks: ['lock', 'config:dev', 'fabricate:lib', 'unlock']
      },
      templates: {
        files: ['<%= meta.src.templates %>/**/*.hbs'],
        tasks: ['lock', 'config:dev', 'emberTemplates', 'unlock']
      },
      html: {
        files: ['<%= meta.src %>/index.ejs'],
        tasks: ['lock', 'config:dev', 'consolidate:index', 'unlock']
      },
      styles: {
        files: ['<%= meta.src.css %>/**/*.scss'],
        tasks: ['lock', 'config:dev', 'sass:build', 'unlock']
      },
      tests: {
        files: ['<%= meta.test %>/**/*_test.js'],
        tasks: ['lock', 'config:dev', 'fabricate:tests', 'unlock'],
      },
      runner: {
        files: ['<%= meta.build.base %>/js/*.js'],
        tasks: ['karma:autotest:run']
      }
    },

    focus: {
      dev: {
        exclude: ['runner'] // Use all watch tasks except the runner
      },
      test: {} // Use all watch tasks
    },

    karma: {
      options: {
        configFile: 'test/karma.conf.js',
        reporters: 'dots',
        autoWatch: false
      },
      autotest: {
        background: true,
        singleRun: false,
        browsers: ['PhantomJS']
      },
      test: {
        singleRun: true,
        browsers: ['PhantomJS']
      },
      integration: {
        singleRun: true,
        browsers: ['Chrome', 'Safari', 'Firefox']
      }
    }
  });

  // Local configurations and runtime modifications
  grunt.loadNpmTasks('grunt-config');
  // Build tasks
  grunt.loadNpmTasks('grunt-ember-templates');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-fabricate');
  grunt.loadNpmTasks('grunt-consolidate');
  // Delivery servers
  grunt.loadNpmTasks('grunt-chauffeur');
  grunt.loadNpmTasks('grunt-gatekeeper');
  // Optimizations
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  // grunt.loadNpmTasks('grunt-contrib-compress');
  // Utility
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-focus');
  grunt.loadNpmTasks('grunt-karma');
  // Local tasks
  grunt.loadTasks('etc/tasks');

  // Usable tasks from command line
  grunt.registerTask('lock', ['chauffeur:dev:lock']);
  grunt.registerTask('unlock', ['chauffeur:dev:unlock']);

  grunt.registerTask('build:setup', ['clean', 'copy']);
  grunt.registerTask('build:html', ['consolidate:index']);
  grunt.registerTask('build:css', ['sass:build']);
  grunt.registerTask('build:templates', ['emberTemplates']);

  grunt.registerTask('prod:js', ['fabricate:app', 'fabricate:lib']);
  grunt.registerTask('dev:js', ['prod:js', 'fabricate:tests']);

  grunt.registerTask('prod:app', ['build:html', 'build:css', 'prod:js', 'build:templates']);
  grunt.registerTask('dev:app', ['build:html', 'build:css', 'dev:js', 'build:templates']);

  grunt.registerTask('optimize', ['cssmin', 'uglify', 'imagemin']);

  grunt.registerTask('servers', ['chauffeur:dev']);

  grunt.registerTask('dev',  ['config:dev', 'build:setup', 'dev:app']);
  grunt.registerTask('prod', ['config:prod', 'build:setup', 'prod:app']);

  grunt.registerTask('run', ['dev', 'servers', 'focus:dev']);
  grunt.registerTask('autotest', ['dev', 'servers', 'karma:autotest', 'focus:test']);
  grunt.registerTask('test', ['dev', 'karma:test']);
  grunt.registerTask('integration', ['dev', 'karma:integration']);

  grunt.registerTask('build', ['clean', 'jshint:dev', 'prod', /*'jshint:build',*/ 'optimize', 'compress:build']);

  grunt.registerTask('default', ['run']);
};

