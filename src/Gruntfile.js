module.exports = function(grunt) {

  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';


  // Folder vars
  // ===================================
  var buildFolder           =   '../build/',
      docsFolder            =   '../docs/',
      common_folder         =   'common/',
      app_folder            =   'app/',
      moderator_folder      =   'moderator/',
      onepager_folder       =   'one-pager/',
      storefront_folder     =   'storefront/',
      pyramid_folder        =   'server/yellr-serv/yellrserv/',
      pyramid_static_folder =   pyramid_folder+'static/';



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
      app:          {src: buildFolder+app_folder+'style/style.css'},
      moderator:    {src: buildFolder+moderator_folder+'style/style.css'},
      onepager:     {src: buildFolder+onepager_folder+'style/style.css'},
      storefront:   {src: buildFolder+storefront_folder+'style/style.css'}
    },




    banner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
            ' */\n\n',


    clean: {
      options: {
        force: true
      },
      application: ['../application/www']
    },


    // concurrent: {
    //   target1: ['watch', 'compass:watch'],
    //   target2: ['jshint', 'mocha']
    // }



    compass: {
      // common css
      index: {
        options: {
          sassDir: common_folder+'style',
          cssDir: buildFolder,
          outputStyle: 'expanded',
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
          outputStyle: 'expanded',
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




    concat: {
      options: {
        // banner: '<%= banner %>',
        // stripBanners: false
        stripBanners: true
      },
      app: {
        src: [
          app_folder+'js/init.js',
          app_folder+'js/yellr/**.js',
          app_folder+'js/yellr/view/**.js'
        ],
        dest: buildFolder + app_folder+'js/app.js'
      },
      moderator: {
        src: [
          moderator_folder+'js/*.js',
          moderator_folder+'js/mod/*.js'
        ],
        dest: buildFolder+moderator_folder+'js/moderator.js'
      },
      storefront: {
        src: [
          storefront_folder+'js/*.js',
          storefront_folder+'js/mod/*.js'
        ],
        dest: buildFolder+storefront_folder+'js/storefront.js'
      }
    },




    copy: {
      // copy fonts
      fonts: {
        files: [
          {expand: true, cwd: common_folder+'style/fonts', src:['**'], dest: buildFolder+app_folder+'style/fonts'},
          {expand: true, cwd: common_folder+'style/fonts', src:['**'], dest: buildFolder+moderator_folder+'style/fonts'},
          {expand: true, cwd: common_folder+'style/fonts', src:['**'], dest: buildFolder+onepager_folder+'style/fonts'},
          {expand: true, cwd: common_folder+'style/fonts', src:['**'], dest: buildFolder+storefront_folder+'style/fonts'},
        ]
      },
      // copy common images (logos and such)
      images: {
        files : [
          {expand: true, cwd: common_folder+'img', src: ['**'], dest: buildFolder+app_folder+'img'},
          {expand: true, cwd: common_folder+'img', src: ['**'], dest: buildFolder+moderator_folder+'img'},
          {expand: true, cwd: common_folder+'img', src: ['**'], dest: buildFolder+onepager_folder+'img'},
          {expand: true, cwd: common_folder+'img', src: ['**'], dest: buildFolder+storefront_folder+'img'},
        ]
      },
      // copy JS libs
      app_js_libs:        {files: [{expand: true, cwd: app_folder+'/js/libs', src: ['**'], dest: buildFolder+app_folder+'js/libs'}] },
      moderator_js_libs:  {files: [{expand: true, cwd: moderator_folder+'/js/libs', src: ['**'], dest: buildFolder+moderator_folder+'js/libs'}] },
      onepager_js_libs:   {files: [{expand: true, cwd: onepager_folder+'/js/libs', src: ['**'], dest: buildFolder+onepager_folder+'js/libs'}] },
      storefront_js_libs: {files: [{expand: true, cwd: storefront_folder+'/js/libs', src: ['**'], dest: buildFolder+storefront_folder+'js/libs'}] },
      // images for specfic parts
      app_images:         {files: [{expand: true, cwd: app_folder+'/img', src: ['**'], dest: buildFolder+app_folder+'img'}] },
      moderator_images:   {files: [{expand: true, cwd: moderator_folder+'/img', src: ['**'], dest: buildFolder+moderator_folder+'img'}] },
      onepager_images:    {files: [{expand: true, cwd: onepager_folder+'/img', src: ['**'], dest: buildFolder+onepager_folder+'img'}] },
      storefront_images:  {files: [{expand: true, cwd: storefront_folder+'/img', src: ['**'], dest: buildFolder+storefront_folder+'img'}] },
      // copy sample JSON files
      app_data:           {files: [{expand: true, cwd: app_folder+'/data', src: ['**'], dest: buildFolder+app_folder+'data'}] },
      moderator_data:     {files: [{expand: true, cwd: moderator_folder+'/data', src: ['**'], dest: buildFolder+moderator_folder+'data'}] },
      onepager_data:      {files: [{expand: true, cwd: onepager_folder+'/data', src: ['**'], dest: buildFolder+onepager_folder+'data'}] },
      storefront_data:    {files: [{expand: true, cwd: storefront_folder+'/data', src: ['**'], dest: buildFolder+storefront_folder+'data'}] },
      // copy things to the actual application folder running cordova
      app:                {files: [{expand: true, cwd: buildFolder+app_folder, src: ['**'], dest: '../application/www'}] },
      config_xml:         {files: [{expand: true, cwd: app_folder, src: ['config.xml'], dest: '../application'}] },

      // pyramid things
      moderator_js_to_pyramid:  {files: [{expand: true, cwd: buildFolder+moderator_folder+'js', src: ['**'], dest: pyramid_folder+moderator_folder+'js'} ] },
      moderator_css_to_pyramid: {files: [{expand: true, cwd: buildFolder+moderator_folder+'style', src: ['**'], dest: pyramid_folder+moderator_folder+'style'} ] },
      moderator_img_to_pyramid: {files: [{expand: true, cwd: buildFolder+moderator_folder+'img', src: ['**'], dest: pyramid_folder+moderator_folder+'img'} ] },
      storefront_js_to_pyramid: {files: [{expand: true, cwd: buildFolder+storefront_folder+'js', src: ['**'], dest: pyramid_static_folder+'js'} ] },
      storefront_css_to_pyramid:{files: [{expand: true, cwd: buildFolder+storefront_folder+'style', src: ['**'], dest: pyramid_static_folder+'style'} ] },
      storefront_img_to_pyramid:{files: [{expand: true, cwd: buildFolder+storefront_folder+'img', src: ['**'], dest: pyramid_static_folder+'img'} ] },
    },




    csscomb: {
      options: {
        config: common_folder+'style/.csscomb.json'
      },
      app:          {expand: true, src: [buildFolder+app_folder+'style/style.css'], dest: './'},
      moderator:    {expand: true, src: [buildFolder+moderator_folder+'style/style.css'], dest: './'},
      onepager:     {expand: true, src: [buildFolder+onepager_folder+'style/style.css'], dest: './'},
      storefront:   {expand: true, src: [buildFolder+storefront_folder+'style/style.css'], dest: './'}
    },





    csslint: {
      options: {
        csslintrc: common_folder+'style/.csslintrc'
      },
      app:        {src: [buildFolder+app_folder+'style/style.css'] },
      moderator:  {src: [buildFolder+moderator_folder+'style/style.css'] },
      onepager:  {src: [buildFolder+onepager_folder+'style/style.css'] },
      storefront:  {src: [buildFolder+storefront_folder+'style/style.css'] }
    },





    cssmin: {
      options: {
        compatibility: 'ie9',
        keepSpecialComments: '*',
        noAdvanced: true
      },
      app: {
        src: [buildFolder+app_folder+'style/style.css'],
        dest: buildFolder+app_folder+'style/style.min.css'
      },
      moderator: {
        src: [buildFolder+moderator_folder+'style/style.css'],
        dest: buildFolder+moderator_folder+'style/style.min.css'
      },
      onepager: {
        src: [buildFolder+onepager_folder+'style/style.css'],
        dest: buildFolder+onepager_folder+'style/style.min.css'
      },
      storefront: {
        src: [buildFolder+storefront_folder+'style/style.css'],
        dest: buildFolder+storefront_folder+'style/style.min.css'
      }
    },




    exec: {
      run_android: 'cd ../application;'+
                   ' cordova run android;'+
                   'echo;echo "    Building and installing Android APK.";echo;',
      build_android: 'cd ../application;'+
                   ' cordova build android;'+
                   'echo;echo "    Android APK built.";echo;',
      build_ios: 'cd ../application;'+
                 ' cordova build ios;'+
                 'echo;echo "    iOS xCode project build.";echo;',
      save_apk: 'cp ../application/platforms/android/ant-build/Yellr-debug.apk ../bin/;' +
                'echo "    APK saved.";echo;'
    },




    htmlmin: {
      app: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          processScripts: ['text/x-handlebars-template']
        },
        files: {
          // 'destination': 'source'
          '../build/app/index.html': '../build/app/index.html'
        }
      }
    },





    jade: {
      index:      {options: jadedebug, files: [{expand: true, cwd: './', src: ['*.jade'], dest: buildFolder, ext: '.html', flatten: true }] },
      app:        {options: jadedebug, files: [{expand: true, cwd: app_folder+'html/',        src: ['index.jade'], dest: buildFolder+app_folder, ext: '.html', flatten: true }] },
      moderator:  {options: jadedebug, files: [{expand: true, cwd: moderator_folder+'html/',  src: ['*.jade', '!_*.jade'], dest: buildFolder+moderator_folder, ext: '.html', flatten: true }] },
      onepager:   {options: jadedebug, files: [{expand: true, cwd: onepager_folder+'html/',   src: ['*.jade', '!_*.jade'], dest: buildFolder+onepager_folder, ext: '.html', flatten: true }] },
      storefront: {options: jadedebug, files: [{expand: true, cwd: storefront_folder+'html/', src: ['*.jade', '!_*.jade'], dest: buildFolder+storefront_folder, ext: '.html', flatten: true }] }
    },





    jshint: {
      options: {
        jshintrc: common_folder+'js/.jshintrc'
      },
      app: {
        src: [
          app_folder+'js/init.js',
          app_folder+'js/yellr/*.js',
          app_folder+'js/yellr/**/*.js'
        ]
      },
      moderator: {
        src: [
          moderator_folder+'js/*.js',
          moderator_folder+'js/mod/*.js',
        ]
      }
    },




    jsonlint: {
      app:        {src: [app_folder+'data/*.json'] },
      moderator:  {src: [moderator_folder+'data/*json'] },
      storefront: {src: [storefront_folder+'data/*json'] }
    },





    uglify: {
      options: {
        mangle: true,
        preserveComments: 'some'
      },
      app:        {files: {'../build/app/js/app.min.js': ['../build/app/js/app.js'] } },
      moderator:  {files: {'../build/moderator/js/moderator.min.js': ['../build/moderator/js/moderator.js'] } },
      storefront:  {files: {'../build/storefront/js/storefront.min.js': ['../build/storefront/js/storefront.js'] } }
    },




    usebanner: {
      options: {
        position: 'top',
        banner: '<%= banner %>'
      },
      app: {
        src: [
          buildFolder+app_folder+'style/style.css',
          buildFolder+app_folder+'style/style.min.css',
          buildFolder+app_folder+'js/app.js',
          buildFolder+app_folder+'js/app.min.js'
        ]
      },
      moderator: {
        src: [
          buildFolder+moderator_folder+'style/style.css',
          buildFolder+moderator_folder+'style/style.min.css',
          buildFolder+moderator_folder+'js/moderator.js',
          buildFolder+moderator_folder+'js/moderator.min.js'
        ]
      },
      storefront: {
        src: [
          buildFolder+storefront_folder+'style/style.css',
          buildFolder+storefront_folder+'style/style.min.css',
          buildFolder+storefront_folder+'js/storefront.js',
          buildFolder+storefront_folder+'js/storefront.min.js'
        ]
      }
    },




    // watch file changes
    watch: {
      // options: {
      //   livereload: true
      // },
      index: {files: ['index.jade'], tasks: ['jade:index'] },
      // watch app things
      app_data:         {files: [app_folder+'data/**'],         tasks: ['jsonlint:app', 'copy:app_data'] },
      app_images:       {files: [app_folder+'img/**'],          tasks: ['copy:app_images'] },
      app_jade:         {files: [app_folder+'html/**'],         tasks: ['jade:app'] },
      app_js:           {files: [app_folder+'js/**'],           tasks: ['concat:app', 'uglify:app'] },
      app_style:        {files: [app_folder+'style/**'],        tasks: ['compass:app', 'autoprefixer:app', 'csscomb:app', 'cssmin:app'] },
      app_config:       {files: [app_folder+'config.xml'],      tasks: ['copy:config_xml'] },
      // moderator folder
      moderator_data:   {files: [moderator_folder+'data/**'],   tasks: ['jsonlint:moderator', 'copy:moderator_data'] },
      moderator_jade:   {files: [moderator_folder+'html/**'],   tasks: ['jade:moderator'] },
      moderator_js:     {files: [moderator_folder+'js/**'],     tasks: ['concat:moderator', 'uglify:moderator', 'copy:moderator_js_to_pyramid'] },
      moderator_style:  {files: [moderator_folder+'style/**'],  tasks: ['compass:moderator', 'autoprefixer:moderator', 'csscomb:moderator', 'cssmin:moderator', 'copy:moderator_css_to_pyramid'] },
      // storefront folder
      storefront_data:   {files: [storefront_folder+'data/**'],   tasks: ['jsonlint:storefront', 'copy:storefront_data'] },
      storefront_jade:   {files: [storefront_folder+'html/**'],   tasks: ['jade:storefront'] },
      storefront_js:     {files: [storefront_folder+'js/**'],     tasks: ['concat:storefront', 'uglify:storefront', 'copy:storefront_js_to_pyramid'] },
      storefront_style:  {files: [storefront_folder+'style/**'],  tasks: ['compass:storefront', 'autoprefixer:storefront', 'csscomb:storefront', 'cssmin:storefront', 'copy:storefront_css_to_pyramid'] },

      // watch common assets
      common_jade:      {files: [common_folder+'html/**'],      tasks: ['build_html'] },
      common_images:    {files: [common_folder+'img/**'],       tasks: ['copy:images'] },
      common_fonts:     {files: [common_folder+'style/fonts/**'],tasks: ['build_css'] },
      common_style:     {files: [common_folder+'style/common.scss'],tasks: ['compass:index'] },
      common_style_libs:{files: [common_folder+'style/libs/**', common_folder+'style/pieces/**', common_folder+'style/theme/**'],tasks: ['build_css'] },

    },



    yuidoc: {
      app: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        logo: 'url.png',
        options: {
          paths: [app_folder+'js/'],
          ignorePaths: [app_folder+'js/libs'],
          outdir: docsFolder+app_folder
        }
      },
      moderator: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        logo: 'url.png',
        options: {
          paths: [moderator_folder+'js/'],
          ignorePaths: [moderator_folder+'js/libs'],
          outdir: docsFolder+moderator_folder
        }
      },
      storefront: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        logo: 'url.png',
        options: {
          paths: [storefront_folder+'js/'],
          ignorePaths: [storefront_folder+'js/libs'],
          outdir: docsFolder+storefront_folder
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
      // build the thing dammit.
      'build_app',
      'build_moderator',
      'build_storefront',
      'build_onepager',
      // 'build_docs',

      // copy fonts and logos
      'copy:fonts',
      'copy:images',

      // server front-end assets
      'build_pyramid',

      // build project index stuff
      'jade:index',
      'compass:index'
    ]);
  });



  // ===================================
  // These two tasks are used internally.
  // You could call them yourself, but there's no real reason too.

  grunt.registerTask('build_app', function() {
    grunt.task.run([
      // HTML
      // build > minify
      'jade:app',
      'htmlmin:app',
      // CSS
      // build > autoprefix > comb > minify
      'compass:app',
      'autoprefixer:app',
      'csscomb:app',
      'cssmin:app',
      // JS
      // concat > minify
      // copy libs
      'concat:app',
      'uglify:app',
      'copy:app_js_libs',
      // JSON
      // lint > copy
      'jsonlint:app',
      'copy:app_data',
      // IMAGES
      'copy:app_images',
      // details
      'usebanner:app'
    ]);
  });


  grunt.registerTask('deploy_app', function() {
    // this packages the built content in build/app
    // into a www/ folder with config.xml
    grunt.task.run([
      'clean:application',
      'copy:app',
      'copy:config_xml'
    ]);
  });

  // ===================================



  grunt.registerTask('build_android', function() {
    grunt.task.run([
      'build_app',
      'deploy_app',
      'exec:build_android'
    ]);
  });


  grunt.registerTask('run_android', function() {
    grunt.task.run([
      'build_app',
      'deploy_app',
      'exec:run_android'
    ]);
  });


  grunt.registerTask('build_ios', function() {
    grunt.task.run([
      'build_app',
      'deploy_app',
      'exec:build_ios'
    ]);
  });


  grunt.registerTask('save_apk', function() {
    grunt.task.run(['exec:save_apk']);
  });






  grunt.registerTask('build_moderator', function() {
    grunt.task.run([
      // HTML
      'jade:moderator',
      // CSS
      // build > autoprefix > comb > minify
      'compass:moderator',
      'autoprefixer:moderator',
      'csscomb:moderator',
      'cssmin:moderator',
      // JS
      // concat > minify
      'concat:moderator',
      'uglify:moderator',
      'copy:moderator_js_libs',
      // JSON
      // lint > copy
      'jsonlint:moderator',
      'copy:moderator_data',
      // IMAGES
      'copy:moderator_images',
      // details
      'usebanner:moderator'
    ]);
  });



  grunt.registerTask('build_storefront', function() {
    grunt.task.run([
      // HTML
      'jade:storefront',
      // CSS
      // build > autoprefix > comb > minify
      'compass:storefront',
      'autoprefixer:storefront',
      'csscomb:storefront',
      'cssmin:storefront',
      // JS
      // concat > minify
      'concat:storefront',
      'uglify:storefront',
      'copy:storefront_js_libs',
      // JSON
      // lint > copy
      'jsonlint:storefront',
      'copy:storefront_data',
      // IMAGES
      'copy:storefront_images',
      // details
      'usebanner:storefront'
    ]);
  });



  grunt.registerTask('build_onepager', function() {
    grunt.task.run([
      // HTML
      'jade:onepager',
      // CSS
      // build > autoprefix > comb > minify
      'compass:onepager',
      'autoprefixer:onepager',
      'csscomb:onepager',
      'cssmin:onepager',
      // IMAGES
      'copy:onepager_images'
    ]);
  });



  grunt.registerTask('build_docs', function() {
    grunt.task.run([
      'yuidoc:app',
      'yuidoc:moderator',
      'yuidoc:storefront'
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
      'compass:index',
      'compass:app',
      'compass:moderator',
      'compass:onepager',
      'compass:storefront',
      'copy:fonts',
    ]);
  });




  // pyramid stuff
  // ----------------------------
  grunt.registerTask('build_pyramid', function() {
    // we build the storefront with default settings,
    // then just copy the assets to the right folder
    grunt.task.run([
      'build_storefront',
      'build_moderator',
      'copy:moderator_js_to_pyramid',
      'copy:moderator_css_to_pyramid',
      'copy:moderator_img_to_pyramid',
      'copy:storefront_js_to_pyramid',
      'copy:storefront_css_to_pyramid',
      'copy:storefront_img_to_pyramid'
    ]);
  });


};
