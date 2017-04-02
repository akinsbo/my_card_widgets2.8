// Hello.
//
// This is JSHint, a tool that helps to detect errors and potential
// problems in your JavaScript code.
//
// To start, simply enter some JavaScript anywhere on this page. Your
// report will appear on the right side.
//
// Additionally, you can toggle specific options in the Configure
// menu.

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks ...dependency for concurrent

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    resourcePath: 'src/AppBundle/Resources',
    bundlePath:'web/bundles/app',
    bowercopy: {
      options: {
        srcPrefix: 'bower_components',
        destPrefix: '' //'web/'
      },
      scripts: {
        files: {
          '<%= resourcePath %>/public/js/jquery.js': 'jquery/dist/jquery.js',
          '<%= resourcePath %>/public/js/bootstrap.js': 'bootstrap/dist/js/bootstrap.js'
        }
      },
      stylesheets: {
        files: {
          '<%= resourcePath %>/public/bootstrap.css': 'bootstrap/dist/css/bootstrap.css',
          '<%= resourcePath %>/public/font-awesome.css': 'font-awesome/css/font-awesome.css'
        }
      },
      fonts: {
        files: {
          '<%= resourcePath %>/public/fonts': 'font-awesome/fonts'
        }
      }
    },

//////////////////cssmin/////////////////////
    cssmin : {
      bundled:{
        files: [{
        expand: true,
        cwd: '<%= bundlePath %>/css',
        src: ['*.css'/*, '!*.min.css'*/],
        dest: '<%= bundlePath %>/css'
        // ext: '.min.css' //add the min extension to the output files
        }]
      }
    },

    uglify : {
            options: {
        banner: '/*! <%= grunt.template.today("mm-dd-yyyy h:MM:ss TT") %> */\n'
    },
      js: {
        files: [{
          expand: true,
          cwd: '<%= bundlePath %>/js/',
          src: '**/*.js',
          dest: '<%= bundlePath %>/js/'
        }]
      }
    },

    clean: {
      js_app: ['web/js/*'],
      js_admin: ['web/js/admin/*'],
      css_app: ['web/css/*'],
      css_admin: ['web/css/admin/*'],
      js_bundle: ['<%= bundlePath %>/js/*.js'],
      css_bundle: ['<%= bundlePath %>/css/*.css'],
      // options: {
      //   'force': false,
      //   'no-write': false
      // }
    },

    watch: {
      twig:{
      files: ['<%= resourcePath %>/views/*'], //['**/*'],
      tasks: ['copy:js', 'jshints'],
      options: {
        livereload:  {
          host:  'localhost',
          port: 35729,
          // key: grunt.file.read('path/to/ssl.key'),//over https connections
          // cert: grunt.file.read('path/to/ssl.crt') //over https connections
            // you can pass in any other options you'd like to the https server, as listed here: http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener
        },
        'spawn': true,
        'interrupt': false,
        'debounceDelay': 500,
        'interval': 100,
        'event': 'all',
        'reload': false,
        'forever': true,
        'dateFormat': null,
        'atBegin': false,
        'cwd': 'web/app_dev.php',//process.cwd(),
        'livereloadOnError': true
      }
    },
    scripts:{
    files: ['<%= resourcePath %>/public/js/'], //['**/*'],
    tasks: ['copy:js', 'jshints'],
    options: {
      livereload:  {
        host:  'localhost',
        port: 35729,
        // key: grunt.file.read('path/to/ssl.key'),//over https connections
        // cert: grunt.file.read('path/to/ssl.crt') //over https connections
          // you can pass in any other options you'd like to the https server, as listed here: http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener
      },
      'spawn': true,
      'interrupt': false,
      'debounceDelay': 500,
      'interval': 100,
      'event': 'all',
      'reload': false,
      'forever': true,
      'dateFormat': null,
      'atBegin': false,
      'cwd': 'web/app_dev.php',//process.cwd(),
      'livereloadOnError': true
      }
    },
    stylesheets:{
      files: ['<%= resourcePath %>/public/css/'], //['**/*'],
      tasks: ['copy:css', 'postcss'],
      options: {
        livereload:  {
          host:  'localhost',
          port: 35729,
          // key: grunt.file.read('path/to/ssl.key'),//over https connections
          // cert: grunt.file.read('path/to/ssl.crt') //over https connections
            // you can pass in any other options you'd like to the https server, as listed here: http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener
        },
        'spawn': true,
        'interrupt': false,
        'debounceDelay': 500,
        'interval': 100,
        'event': 'all',
        'reload': false,
        'forever': true,
        'dateFormat': null,
        'atBegin': false,
        'cwd': 'web/app_dev.php',//process.cwd(),
        'livereloadOnError': true
        }
      }
    },

    jshint: {
      files: ['Gruntfile.js', '<%= resourcePath %>/public/js/*.js', 'web/js/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },

    shell: {
    cache_clear_prod: {
        options: {
            stdout: true
        },
        command: 'php app/console cache:clear --env=prod --no-debug'
    },
    composer_dump_autoload: {
        options: {
            stdout: true
        },
        command: 'composer dump-autoload --optimize'
    }
    },

    /////////css/////////////////////////////
    postcss: {
       options: {
         map: false, // inline sourcemaps
        //  diff: true // or 'custom/path/to/file.css.patch'
        //  syntax: require('postcss-scss') // work with SCSS directly
        // parser: require('postcss-safe-parser') // instead of a removed `safe` option

         // or
        //  map: {
        //      inline: false, // save all sourcemaps as separate files...
        //      annotation: 'web/dist/css/maps/' // ...to the specified directory
        //  },

         processors: [
           require('pixrem')(), // add fallbacks for rem units
           require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
           require('cssnano')() // minify the result
         ]
       },
       dist: {
         src: ['!<%= bundlePath %>/css/wrap-images.css',
             '<%= bundlePath %>/css/*.css'
                ]
       }
     },
    // concat: {
    //     options: {
    //         stripBanners: true
    //     },
    //     css: {
    //         src: [
    //             'web/css/bootstrap.css',
    //             'web/css/font-awesome.css',
    //             '<%= resourcePath %>/public/css/*.css'
    //         ],
    //         dest: 'web/css/bundled.css'
    //     },
    //     js : {
    //         src : [
    //             'web/js/jquery.js',
    //             'web/js/bootstrap.js',
    //             '<%= resourcePath %>/public/js/*.js'
    //         ],
    //         dest: 'web/js/bundled.js'
    //     }
    // },

    // aws: grunt.file.readJSON('aws-credentials.json'),
    // s3: {
    //     options: {
    //         key: '<%= aws.key %>',
    //         secret: '<%= aws.secret %>',
    //         bucket: '<%= aws.bucket %>'
    //     },
    //     cdn: {
    //         upload: [
    //             {
    //                 src: 'web/css/*',
    //                 dest: 'css/'
    //             },
    //
    //             {
    //                 src: 'web/fonts/*',
    //                 dest: 'fonts/'
    //             },
    //             {
    //                 src: 'web/images/*',
    //                 dest: 'images/'
    //             },
    //             {
    //                 src: 'web/js/*',
    //                 dest: 'js/'
    //             }
    //         ]
    //     }
    // },
    //
    // sass: {
    //   task: {
    //     src: ['source'],
    //     dest: 'destination'
    //   },
    //   options: {
    //     'sourcemap': 'auto',
    //     'trace': false,
    //     'unixNewlines': false,
    //     'check': false,
    //     'style': 'nested',
    //     'precision': 3,
    //     'quiet': false,
    //     'compass': false,
    //     'debugInfo': false,
    //     'lineNumbers': false,
    //     'loadPath': [],
    //     'require': [],
    //     'cacheLocation': '.sass-cache',
    //     'noCache': false,
    //     'bundleExec': false,
    //     'banner': '',
    //     'update': false
    //   }
    // },
     imagemin: {
       task: {
            expand: true,
            cwd: '<%= resourcePath %>/public/img/',
            src: ['**'],
            dest: '<%= bundlePath %>/img/'
       },
       options: {
         'optimizationLevel': 3,
         'progressive': true,
         'interlaced': true,
         'use': null
       }
     },
    // connect: {
    //   task: {
    //     src: ['source'],
    //     dest: 'destination'
    //   },
    //   options: {
    //     'port': 9000,
    //     'protocol': 'http',
    //     'hostname': '0.0.0.0',
    //     'base': '.',
    //     'directory': null,
    //     'keepalive': false,
    //     'debug': false,
    //     'livereload': false,
    //     'open': false,
    //     'useAvailablePort': false,
    //     'onCreateServer': null,
    //     'middleware': []
    //   }
    // },
    modernizr: {
      dist: {
        "parseFiles": true,
        "customTests": [],
        "devFile": "<%= resourcePath %>/modernizr-dev.js",
        "dest": "<%= bundlePath %>/modernizr-output.js",
        "tests": [
          // Tests
        ],
        "options": [
          "setClasses"
        ],
        "uglify": true
      }
    },
        copy: {
          images: {
            files: [
              {
            expand: true,
            cwd: '<%= resourcePath %>/public/img/',
            src: ['**'],
            dest: '<%= bundlePath %>/img/'
              }
            ]
          },
          css: {
            files: [{
            expand: true,
            cwd: '<%= resourcePath %>/public/css/',
            src: ['**'],
            dest: '<%= bundlePath %>/css/'
            }
          ]
        },
          js: {
            files: [{
            expand: true,
            cwd: '<%= resourcePath %>/public/js/',
            src: ['**'],
            dest: '<%= bundlePath %>/js/'
            }
          ]
        },

        fonts: {
          files: [{
          expand: true,
          cwd: 'web/fonts/',
          src: ['**'],
          dest: '<%= bundlePath %>/fonts/'
          }
        ]
      },
      //   main: {
      //  files: [
      //      {
      //          expand: true,
      //          src: ['<%= resourcePath %>/public/**'], dest: 'web'}
      //         ]
      //     }
        },

        concurrent: {
          copyall: {
            tasks: [[/*'bowercopy',*/ 'copy:fonts','copy:js'], 'copy:css'],//'copy:images'
            // dest: 'destination'
            options: {
              'limit': 2,
              'logConcurrentOutput': true
            }
          },

          postcss_uglify_imagemin_mordernizr: {
            tasks: [['postcss', 'uglify', 'imagemin'], 'modernizr'],
            // dest: 'destination'
            options: {
              'limit': 2,
              'logConcurrentOutput': true
            }
          },

          jshint_n_watch: {
            tasks: [/*'jshint',*/ 'watch'],
            // dest: 'destination'
            options: {
              'limit': 2,
              'logConcurrentOutput': true
            }
          },
        },

  });

  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-copy-to');
  grunt.loadNpmTasks("grunt-modernizr");
  // grunt.loadNpmTasks('grunt-s3');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-postcss');


  grunt.registerTask('default', ['clean','concurrent:copyall','concurrent:postcss_uglify_imagemin_mordernizr']); //''postcss',concurrent:jshint_n_watch',

//  grunt.registerTask('dev', ['default', 'watch']);

// samples of other tasks
//    grunt.registerTask('optimizejs', function() {
//     grunt.task.run("clean:js_app");
//     grunt.task.run("clean:js_admin");
//     grunt.task.run("copy:js_app");
//     grunt.task.run("copy:js_admin");
//     grunt.task.run("requirejs");
//     grunt.task.run("clean:js_app");
//     grunt.task.run("clean:js_admin");
//     grunt.task.run("copy:js_app_build");
//     grunt.task.run("clean:js_app_build");
//     grunt.task.run("copy:js_admin_build");
//     grunt.task.run("clean:js_admin_build");
// });
//
// grunt.registerTask('prod', function() {
//     grunt.task.run("clean");
//     grunt.task.run("less");
//     grunt.task.run("shell:cache_clear_prod");
//     grunt.task.run("shell:composer_dump_autoload");
//     grunt.task.run("optimizejs");
// });
// grunt.registerTask('clean');
// grunt.registerTask('copyall', ['concurrent:copyall', 'concurrent:cssmin_n_uglify', 'concurrent:jshint_n_watch']);
// grunt.registerTask('postcss');
// grunt.registerTask('shell');

  // grunt.registerTask('default', ['concurrent:target1', 'concurrent:target2', 'bowercopy', 'copy', 'concat', 'cssmin', 'uglify', 'clean', 'watch', 'jshint', 'sass', 'imagemin', 'connect']);
  // grunt.registerTask('deploy', ['s3']);
};
