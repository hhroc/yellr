module.exports = function(grunt) {

  // Folder vars
  // ===================================
  var buildFolder = '../build/';
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
  // ===================================
  // ===================================
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // compile SASS files
    // ===================================
    compass: {
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
          cssDir: app_folder+'www/style',
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


    // copy files (font, img, js)
    copy: {
      fonts: {
        files: [{expand: true, cwd: 'style/fonts', src:['**'], dest: buildFolder+'style/fonts'}]
      },
      img: {
        files : [{expand: true, cwd: 'img', src: ['**'], dest: buildFolder+'img'}]
      },
      js: {
        files : [{expand: true, cwd: 'js', src: ['**'], dest: buildFolder+'js'}]
      },
      data: {
        files : [{expand: true, cwd: 'data', src: ['**'], dest: buildFolder+'data'}]
      },
      // app_js: {
      //   files : [{expand: true, cwd: 'js', src: ['app.js'], dest: appFolder+'js'}]
      // },
      // app_data: {
      //   files : [{expand: true, cwd: 'data', src: ['**'], dest: appFolder+'data'}]
      // },
      // to_app: {
      //   files : [{expand: true, cwd: '../build', src: ['data/**', 'js/**', 'style/**', 'img/**'], dest: appFolder}]
      // }
    },


    // compile jade files
    jade: {
      index: {
        options: jadedebug,
        files: [{expand: true, cwd: './', src: ['*.jade'], dest: buildFolder, ext: '.html', flatten: true }]
      },
      app: {
        options: jadedebug,
        files: [{expand: true, cwd: './app/html/', src: ['*.jade'], dest: buildFolder+app_folder, ext: '.html', flatten: true }]
      },
      moderator: {
        options: jadedebug,
        files: [{expand: true, cwd: './moderator/html/', src: ['*.jade'], dest: buildFolder+moderator_folder, ext: '.html', flatten: true }]
      },
      onepager: {
        options: jadedebug,
        files: [{expand: true, cwd: './one-pager/html/', src: ['*.jade'], dest: buildFolder+onepager_folder, ext: '.html', flatten: true }]
      },
      storefront: {
        options: jadedebug,
        files: [{expand: true, cwd: './storefront/html/', src: ['*.jade'], dest: buildFolder+storefront_folder, ext: '.html', flatten: true }]
      }
    },


    // watch file changes
    watch: {
      sass: {
        files: ['style/*.scss','style/**/*.scss'],
        tasks: ['compass:build']
      },
      jade: {
        files: ['*.jade'],
        tasks: ['jade:index']
      },
      moderator_pages: {
        files: ['html/**/*.jade'],
        tasks: ['jade:moderator']
      },
      img: {
        files: ['img/*.*', 'img/**/*.*'],
        tasks: ['copy:img']
      },
      js:{
        files: ['js/*.js', 'js/**/*.js'],
        tasks: ['copy:js']
      },
      app_js: {
        files: ['js/app.js'],
        tasks: ['copy:app_js']
      },
      data:{
        files: ['data/*.*', 'data/**/*.*'],
        tasks: ['copy:data', 'copy:app_data']
      },
      fonts:
      {
        files: ['style/fonts/*.*'],
        tasks: ['copy:fonts']
      }
    },

    // yui compression
    min: {
      dist: {
        src: [buildFolder+'js/main.js', buildFolder+'js/modules/*.js'],
        dest: buildFolder+'js/main.min.js'
      }
    },
    cssmin: {
      dist: {
        src: [buildFolder+'style/style.css', buildFolder+'style/modules/*.css'],
        dest: buildFolder+'style/style.min.css'
      }
    }

  });



  // Load the plugins
  // ===================================
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-yui-compressor');




  // Default task(s)
  // ===================================
  grunt.registerTask('default', ['build']);

  grunt.registerTask('build', function() {
    grunt.task.run([
      // build html
      'jade:index',
      'jade:app',
      'jade:moderator',
      'jade:onepager',
      'jade:storefront',

      'compass:build',
      'copy:img',
      'copy:js',
      'copy:data',
      'copy:fonts',
    ]);
  });

  grunt.registerTask('minify', function() {
    grunt.task.run([
      'min',
      'cssmin'
    ]);
  });

  grunt.registerTask('deploy', function() {
    grunt.task.run([
      'minify',
      'copy:to_app'
    ]);
  });

  grunt.registerTask('app', function() {
    grunt.task.run(['copy:to_app']);
  });


};