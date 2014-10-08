init:
	# install gems, grunt
	# cd ./src; bundle install; npm install; TO REMOVE - gonna move off of Ruby and Compass to Stylus
	cd ./src; npm install;
	# build the corova app
	cordova create application com.hhroc.yellr "Yellr";
	# add all cordova plugins. check the docs for a detailed list
	cd application; cordova plugin add org.apache.cordova.battery-status
	cd application; cordova plugin add org.apache.cordova.camera
	cd application; cordova plugin add org.apache.cordova.console
	cd application; cordova plugin add org.apache.cordova.device
	cd application; cordova plugin add org.apache.cordova.dialogs
	cd application; cordova plugin add org.apache.cordova.file
	cd application; cordova plugin add org.apache.cordova.file-transfer
	cd application; cordova plugin add org.apache.cordova.geolocation
	cd application; cordova plugin add org.apache.cordova.globalization
	cd application; cordova plugin add org.apache.cordova.media
	cd application; cordova plugin add org.apache.cordova.media-capture
	cd application; cordova plugin add org.apache.cordova.network-information
	cd application; cordova plugin add org.apache.cordova.splashscreen
	cd application; cordova plugin add org.apache.cordova.vibration
	cd application; cordova plugin add org.apache.cordova.statusbar

	# grunt tings - build project, build www not that application exists
	# we build with grunt after running cordova because Cordova must
	# create the directory first
	cd ./src; grunt; grunt deploy_app;

	# feedback
	clear; echo; echo Project build complete.; echo; echo Run \'make ios\', \'make android\', or \'make firefox\' to build an app.; echo Must have the SDKs for iOS and Android installed.; echo;



ios:
	cd application; cordova platform add ios;
	# copy app icons and splash screens
	cp -r ./src/app/icons/ios/ ./application/platforms/ios/Yellr/Resources/icons/;
	cp -r ./src/app/splash-screens/ios/ ./application/platforms/ios/Yellr/Resources/splash/;
	# show zcode project
	open application/platforms/ios;

	# feedback
	clear; echo; echo iOS build complete. Opening folder containing Xcode project; echo;



android:
	cd application; cordova platform add android;
	# copy app icons and splash screens
	cp -r ./src/app/icons/android/ ./application/platforms/android/res/
	cp -r ./src/app/splash-screens/android/ ./application/platforms/android/res/
	# build it
	cd application; cordova build android;

	# feddback
	clear; echo; echo Android build complete. APK is in application/platforms/android/ant-build/; echo;


firefox:
	cd application; cordova platform add firefoxos;
	cd application; cordova prepare;
	clear; echo; echo Firefox OS build complete; echo Test it out using the App Manager: https://developer.mozilla.org/en-US/Firefox_OS/Using_the_App_Manager; echo;


server:
	cd build; echo; echo Live link: http://127.0.0.1:8000; echo; python -m SimpleHTTPServer;
