grunt commands
===================================

grunt
----------------------------
creates the build folder
run a simple python server from this directory

  // build html
  'jade:index',
  'jade:app',
  'jade:moderator',
  'jade:onepager',
  'jade:storefront',
  // compile sass
  'compass:app',
  'compass:www',
  'compass:moderator',
  'compass:onepager',
  'compass:storefront',
  // copy fonts
  'copy:fonts',
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




grunt build_app
----------------------------
copies the www/ folder to application/www

  'copy:index_html',
  'compass:www',
  'copy:images_to_www',
  'copy:js_to_www',
  'copy:data_to_www',
  'copy:www',
  'copy:config_xml'

after compiling css, js,data, images, and copying index.html to the src/app/www folder
	copies index.html
		index.html ==> www/index.html

	copies www folder
		www ==> ../application/
	copies config.xml
		config.xml ==> ../application/config.xml




grunt watch:app
grunt watch:moderator
grunt watch:onepager
grunt watch:storefront
----------------------------
watch for file changes within each specific subdirectory




build folder
===================================
build/
	index.html (index.jade)
	app/
	moderator/
	storefront/
	one-pager/
