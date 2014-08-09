module.exports = function(grunt) {

  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';


  // Folder vars
  // ===================================
  var buildFolder = '../build/';
  var applicationFolder = '../application/';
  var common_folder = 'common/';
  var app_build = 'www/';
  var app_folder = 'app/';
  var moderator_folder = 'moderator/';
  var onepager_folder = 'one-pager/';
  var storefront_folder = 'storefront/';



  // jade settings
  // ----------------------------
  var jadedebug = {
    compileDebug: false,
    pretty: true,

    data:{
      partial: function(templatePath, dataObj){
        var template = grunt.file.read(templatePath);

        if(typeof(dataObj) === String){
          dataObj = grunt.file.readJSON(dataObj);
        }

        if(templatePath.match(/.jade/g)){
          return require('grunt-contrib-jade/node_modules/jade').compile(template, {filename: templatePath, pretty: true})(dataObj);
        }else{
          return template;
        }
      },
      data: function(path){
        return grunt.file.readJSON(path);
      },
      locals:{
        getConfigFile:function(path){
          return grunt.file.readJSON(path);
        },
        data: function(path){
          return jadedebug.data.data(path);
        },
        partial: function(templatePath, dataObj){
          return jadedebug.data.partial(templatePath, dataObj);
        }

      }
    }
  }




  // Project configuration. (the good stuff)
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),



    banner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
            ' */\n',


    clean: ['../build'],



    jshint: {
      options: {
        jshintrc: 'common/js/.jshintrc'
      },
      src: {
        src: ['js/*.js', 'js/**/*.js']
      }
    },



    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      build: {
        src: [
          'js/main.js'
          // 'js/libs/*.js',
          // 'js/project/*.js'
        ],
        dest: buildFolder+'js/<%= pkg.name %>.js'
      }
    },



    uglify: {
      options: {
        preserveComments: 'some'
      },
      build: {
        src: '<%= concat.monte.dest %>',
        dest: buildFolder+'js/<%= pkg.name %>.min.js'
      }
    },



    autoprefixer: {
      options: {
        browsers: [
          'Android 2.3',
          'Android >= 4',
          'Chrome >= 20',
          'Firefox >= 24', // Firefox 24 is the latest ESR
          'Explorer >= 8',
          'iOS >= 6',
          'Opera >= 12',
          'Safari >= 6'
        ]
      },
      build: {
        options: {
          map: true
        },
        src: buildFolder+'style/<%= pkg.name %>.css'
      }
    },



    csslint: {
      options: {
        csslintrc: 'style/.csslintrc'
      },
      src: [buildFolder+'style/<%= pkg.name %>.css']
    },



    cssmin: {
      options: {
        compatibility: 'ie8',
        keepSpecialComments: '*',
        noAdvanced: true
      },
      build: {
        src: [buildFolder+'style/<%= pkg.name %>.css'],
        dest: buildFolder+'style/<%= pkg.name %>.min.css'
      }
    },



    usebanner: {
      options: {
        position: 'top',
        banner: '<%= banner %>'
      },
      files: {
        src: [
          buildFolder+'style/<%= pkg.name %>.css',
          buildFolder+'style/<%= pkg.name %>.min.css',
          buildFolder+'js/<%= pkg.name %>.js',
          buildFolder+'js/<%= pkg.name %>.min.js'
        ]
      }
    },



    csscomb: {
      options: {
        config: 'style/.csscomb.json'
      },
      build: {
        expand: true,
        cwd: buildFolder+'style/',
        src: ['*.css', '!*.min.css'],
        dest: buildFolder+'style/'
      }
    },



    // compile SASS files
    // ===================================
    compass: {
      // common css
      common: {
        options: {
          sassDir: common_folder+'style',
          cssDir: buildFolder,
          outputStyle: 'compressed',
          noLineComments: true,
          force: true,
          relativeAssets: true,
        }
      },
      // build app styles to build folder
      app: {
        options: {
          sassDir: app_folder+'style',
          cssDir: buildFolder+app_folder+'style',
          outputStyle: 'expanded',
          noLineComments: true,
          force: true,
          relativeAssets: true,
        }
      },
      // send app styles to its 'www' dir
      www: {
        options: {
          sassDir: app_folder+'style',
          cssDir: app_folder+app_build+'style',
          outputStyle: 'compressed',
          noLineComments: true,
          force: true,
          relativeAssets: true,
        }
      },
      // build moderator styles
      moderator: {
        options: {
          sassDir: moderator_folder+'style',
          cssDir: buildFolder+moderator_folder+'style',
          outputStyle: 'expanded',
          noLineComments: true,
          force: true,
          relativeAssets: true,
        }
      },
      // one-pager
      onepager: {
        options: {
          sassDir: onepager_folder+'style',
          cssDir: buildFolder+onepager_folder+'style',
          outputStyle: 'compressed',
          noLineComments: true,
          force: true,
          relativeAssets: true,
        }
      },
      // storefront
      storefront: {
        options: {
          sassDir: storefront_folder+'style',
          cssDir: buildFolder+storefront_folder+'style',
          outputStyle: 'expanded',
          noLineComments: true,
          force: true,
          relativeAssets: true,
        }
      }
    },


    // Copy files (font, img, js)
    // ===================================
    copy: {
      // copy fonts
      fonts: {
        files: [
          // app
          {expand: true, cwd: 'common/style/fonts', src:['**'], dest: buildFolder+app_folder+'style/fonts'},
          // www
          {expand: true, cwd: 'common/style/fonts', src:['**'], dest: app_folder+app_build+'style/fonts'},
          // moderator
          {expand: true, cwd: 'common/style/fonts', src:['**'], dest: buildFolder+moderator_folder+'style/fonts'},
          // one-pager
          {expand: true, cwd: 'common/style/fonts', src:['**'], dest: buildFolder+onepager_folder+'style/fonts'},
          // storefront
          {expand: true, cwd: 'common/style/fonts', src:['**'], dest: buildFolder+storefront_folder+'style/fonts'},
        ]
      },
      // copy common images (logos and such)
      images: {
        files : [
          {expand: true, cwd: 'common/img', src: ['**'], dest: buildFolder+app_folder+'img'},
          {expand: true, cwd: 'common/img', src: ['**'], dest: app_folder+app_build+'img'},
          {expand: true, cwd: 'common/img', src: ['**'], dest: buildFolder+moderator_folder+'img'},
          {expand: true, cwd: 'common/img', src: ['**'], dest: buildFolder+onepager_folder+'img'},
          {expand: true, cwd: 'common/img', src: ['**'], dest: buildFolder+storefront_folder+'img'},
        ]
      },
      // copy app images
      app_images: {files: [{expand: true, cwd: app_folder+'/img', src: ['**'], dest: buildFolder+app_folder+'img'}] },
      // copy them to the www folder
      images_to_www: {files: [{expand: true, cwd: app_folder+'/img', src: ['**'], dest: app_folder+app_build+'img'}] },
      // copy moderator images
      moderator_images: {files: [{expand: true, cwd: moderator_folder+'/img', src: ['**'], dest: buildFolder+moderator_folder+'img'}] },
      // copy onepager images
      onepager_images: {files: [{expand: true, cwd: onepager_folder+'/img', src: ['**'], dest: buildFolder+onepager_folder+'img'}] },
      // copy storefront images
      storefront_images: {files: [{expand: true, cwd: storefront_folder+'/img', src: ['**'], dest: buildFolder+storefront_folder+'img'}] },
      // copy JS files
      js: {
        files : [
          {expand: true, cwd: 'common/js', src: ['**'], dest: buildFolder+app_folder+'js'},
          {expand: true, cwd: 'common/js', src: ['**'], dest: app_folder+app_build+'js'},
          {expand: true, cwd: 'common/js', src: ['**'], dest: buildFolder+moderator_folder+'js'},
          {expand: true, cwd: 'common/js', src: ['**'], dest: buildFolder+onepager_folder+'js'},
          {expand: true, cwd: 'common/js', src: ['**'], dest: buildFolder+storefront_folder+'js'},
        ]
      },
      // copy app js files
      app_js: {files: [{expand: true, cwd: app_folder+'/js', src: ['**'], dest: buildFolder+app_folder+'js'}] },
      // copy js to www
      js_to_www: {files: [{expand: true, cwd: app_folder+'/js', src: ['**'], dest: app_folder+app_build+'js'}] },
      // copy moderator js
      moderator_js: {files: [{expand: true, cwd: moderator_folder+'/js', src: ['**'], dest: buildFolder+moderator_folder+'js'}] },
      // copy onepager js
      onepager_js: {files: [{expand: true, cwd: onepager_folder+'/js', src: ['**'], dest: buildFolder+onepager_folder+'js'}] },
      // copy storefront js
      storefront_js: {files: [{expand: true, cwd: storefront_folder+'/js', src: ['**'], dest: buildFolder+storefront_folder+'js'}] },
      // copy sample data
      data: {
        files : [
          {expand: true, cwd: 'common/data', src: ['*.json'], dest: buildFolder+app_folder+'data'},
          {expand: true, cwd: 'common/data', src: ['*.json'], dest: app_folder+app_build+'data'},
          {expand: true, cwd: 'common/data', src: ['*.json'], dest: buildFolder+moderator_folder+'data'},
          {expand: true, cwd: 'common/data', src: ['*.json'], dest: buildFolder+onepager_folder+'data'},
          {expand: true, cwd: 'common/data', src: ['*.json'], dest: buildFolder+storefront_folder+'data'},
        ]
      },
      // copy specfic datasets
      app_data: {files: [{expand: true, cwd: app_folder+'/data', src: ['**'], dest: buildFolder+app_folder+'data'}] },
      data_to_www: {files: [{expand: true, cwd: app_folder+'/data', src: ['**'], dest: app_folder+app_build+'data'}] },
      moderator_data: {files: [{expand: true, cwd: moderator_folder+'/data', src: ['**'], dest: buildFolder+moderator_folder+'data'}] },
      onepager_data: {files: [{expand: true, cwd: onepager_folder+'/data', src: ['**'], dest: buildFolder+onepager_folder+'data'}] },
      storefront_data: {files: [{expand: true, cwd: storefront_folder+'/data', src: ['**'], dest: buildFolder+storefront_folder+'data'}] },
      // copy things to the actual application folder running cordova
      config_xml: {files: [{expand: true, cwd: app_folder, src: ['config.xml'], dest: applicationFolder}] },
      index_html:{files: [{expand: true, cwd: app_folder, src: ['index.html'], dest: app_folder+app_build}] },
      www: {files: [{expand: true, cwd: app_folder+'www', src: ['**'], dest: applicationFolder+'www'}] },
    },


    // compile jade files
    // ===================================
    jade: {
      // index page, show 4 links
      index: {
        options: jadedebug,
        files: [{expand: true, cwd: './', src: ['*.jade'], dest: buildFolder, ext: '.html', flatten: true }]
      },
      // build app markup
      app: {
        options: jadedebug,
        files: [{expand: true, cwd: './app/html/', src: ['*.jade'], dest: buildFolder+app_folder, ext: '.html', flatten: true }]
      },
      // build moderator pages
      moderator: {
        options: jadedebug,
        files: [{expand: true, cwd: './moderator/html/', src: ['*.jade'], dest: buildFolder+moderator_folder, ext: '.html', flatten: true }]
      },
      // build the one-pager
      onepager: {
        options: jadedebug,
        files: [{expand: true, cwd: './one-pager/html/', src: ['*.jade'], dest: buildFolder+onepager_folder, ext: '.html', flatten: true }]
      },
      // build the storefront
      storefront: {
        options: jadedebug,
        files: [{expand: true, cwd: './storefront/html/', src: ['*.jade'], dest: buildFolder+storefront_folder, ext: '.html', flatten: true }]
      }
    },

    // tasks: ['compass:www', 'copy:images_to_www', 'copy:js_to_www', 'copy:data_to_www']

    // watch file changes
    watch: {
      index: {
        files: ['index.jade'],
        tasks: ['jade:index']
      },
      // watch app things
      app_data: {files: [app_folder+'data/**'], tasks: ['copy:app_data'] },
      app_jade: {files: [app_folder+'html/**'], tasks: ['jade:app'] },
      app_images: {files: [app_folder+'img/**'], tasks: ['copy:app_images'] },
      app_js: {files: [app_folder+'js/**'], tasks: ['copy:app_js'] },
      app_style: {files: [app_folder+'style/**'], tasks: ['compass:app'] },
      app_html: {files: [app_folder+'index.html'], tasks: ['copy:index_html'] },
      app_config: {files: [app_folder+'config.xml'], tasks: ['copy:config_xml'] },
      www: {
        files: [app_folder+app_build+'**'],
        tasks: ['copy:index_html', 'copy:www', 'copy:config_xml']
      },
      moderator_js: {files: [moderator_folder+'js/**'], tasks: ['copy:moderator_js'] },
      moderator_style: {files: [moderator_folder+'style/**'], tasks: ['compass:moderator'] },
      moderator_html: {files: [moderator_folder+'html/**'], tasks: ['jade:moderator'] },
      moderator_data: {files: [moderator_folder+'data/**'], tasks: ['copy:moderator_data'] },
      // moderator: {},
      // onepager: {
      //   files: [onepager_folder+'**'],
      //   tasks: ['onepager']
      // },
      // storefront: {},
      // watch common assets
      common_data: {files: [common_folder+'data/**'], tasks: ['copy:data'] },
      common_jade: {files: [common_folder+'html/**'], tasks: ['build_html'] },
      common_images: {files: [common_folder+'img/**'], tasks: ['copy:images'] },
      common_js: {files: [common_folder+'js/**'], tasks: ['copy:js'] },
      common_fonts: {files: [common_folder+'style/fonts/**'], tasks: ['compass:common', 'build_css'] },
      common_style: {files: [common_folder+'style/common.scss'], tasks: ['compass:common'] },
      common_style_libs: {files: [common_folder+'style/libs/**', common_folder+'style/pieces/**', common_folder+'style/theme/**'], tasks: ['compass:common', 'build_css'] },

    },


    htmlmin: {                                     // Task
      dist: {                                      // Target
        options: {                                 // Target options
          removeComments: true,
          collapseWhitespace: true
        },
        files: {                                   // Dictionary of files
          'dist/index.html': 'src/index.html',     // 'destination': 'source'
          'dist/contact.html': 'src/contact.html'
        }
      },
      dev: {                                       // Another target
        files: {
          'dist/index.html': 'src/index.html',
          'dist/contact.html': 'src/contact.html'
        }
      }
    },



    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          paths: 'path/to/source/code/',
          themedir: 'path/to/custom/theme/',
          outdir: 'where/to/save/docs/'
        }
      }
    }

  });



  // Load the plugins
  // ===================================
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
  require('time-grunt')(grunt);




  // Default task(s)
  // ===================================
  grunt.registerTask('default', ['build']);

  grunt.registerTask('build', function() {
    grunt.task.run([
      'build_html',       // build html
      'build_css',        // compile sass (copy fonts)
      // copy images
      'copy:images',
      'copy:app_images',
      'copy:images_to_www',
      'copy:moderator_images',
      'copy:onepager_images',
      'copy:storefront_images',
      // js
      'copy:js',
      'copy:app_js',
      'copy:js_to_www',
      'copy:moderator_js',
      'copy:onepager_js',
      'copy:storefront_js',
      // data
      'copy:data',
      'copy:app_data',
      'copy:data_to_www',
      'copy:moderator_data',
      'copy:onepager_data',
      'copy:storefront_data',
    ]);
  });

  grunt.registerTask('build_app', function() {
    grunt.task.run([
      'copy:index_html',
      'compass:www',
      'copy:images_to_www',
      'copy:js_to_www',
      'copy:data_to_www',
      'copy:www',
      'copy:config_xml'
    ]);
  });

  grunt.registerTask('copy_app', function() {
    grunt.task.run([
      'copy:index_html',
      'copy:www',
      'copy:config_xml',
    ]);
  });

  grunt.registerTask('onepager', function() {
    grunt.task.run([
      'jade:onepager',
      'compass:onepager',
      'copy:onepager_images',
      'copy:onepager_js',
      'copy:onepager_data',
    ]);
  });

  grunt.registerTask('build_html', function() {
    grunt.task.run([
      'jade:index',
      'jade:app',
      'jade:moderator',
      'jade:onepager',
      'jade:storefront',
    ]);
  });

  grunt.registerTask('build_css', function() {
    grunt.task.run([
      'compass:app',
      'compass:www',
      'compass:moderator',
      'compass:onepager',
      'compass:storefront',
      'copy:fonts',
    ]);
  });




  grunt.registerTask('minify', function() {
    grunt.task.run([
      'min',
      'cssmin'
    ]);
  });

};
