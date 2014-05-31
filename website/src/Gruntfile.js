module.exports = function(grunt) {

  var buildFolder = '../build/';

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


  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // compile SASS files
    compass: {
      build: {
        options: {
          sassDir: 'style',
          cssDir: buildFolder+'style',
          outputStyle: 'expanded',
          noLineComments: true,
          force: true,
          relativeAssets: true,
        }
      },
      deploy: {
        options: {
          sassDir: 'style',
          cssDir: buildFolder+'style',
          outputStyle: 'compressed',
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
      }
    },


    // compile jade files
    jade: {
      index: {
        options: jadedebug,
        files: [{expand: true, cwd: './', src: ['*.jade'], dest: buildFolder, ext: '.html', flatten: true }]
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
      img: {
        files: ['img/*.*', 'img/**/*.*'],
        tasks: ['copy:img']
      },
      js:{
        files: ['js/*.js', 'js/**/*.js'],
        tasks: ['copy:js']
      },
      fonts:
      {
        files: ['fonts/*.*'],
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
  grunt.registerTask('default', ['debug']);

  grunt.registerTask('debug', function() {
    grunt.task.run([
      'compass:build',
      'copy:img',
      'copy:js',
      'copy:fonts',
      'jade:index',
    ]);
  });

  grunt.registerTask('deploy', function() {
    grunt.task.run([
      'min',
      'cssmin'
    ]);
  });

};