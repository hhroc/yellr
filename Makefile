init:
	# install gems, grunt
	cd ./src; bundle install; npm install;
	# build the corova app
	cordova create application com.hhroc.yellr "Yellr";
	rm -rf application/www/css;
	# add all cordova plugins. check the docs for a detailed list
	cd application; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-device.git;
	cd application; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-network-information.git;
	cd application; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-battery-status.git;
	cd application; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-geolocation.git;
	cd application; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-camera.git;
	cd application; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-media-capture.git;
	cd application; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-media.git;
	cd application; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-file.git;
	cd application; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-file-transfer.git;
	cd application; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-dialogs.git;
	cd application; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-vibration.git;
	cd application; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-globalization.git;
	cd application; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-splashscreen.git;
	cd application; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-console.git;
	
	# grunt tings - build project, build www not that application exists
	# we build with grunt after running cordova because Cordova must
	# create the directory first
	cd ./src; grunt; grunt build_app;

	# feedback
	clear; echo; echo Project build complete.; echo; echo Run \'make ios\' or \'make android\' to build an app.; echo Must have the SDKs for those devices installed.;



ios:
	cd application; cordova platform add ios;
	# copy app icons and splash screens
	cp -r ./src/app/icons/ios/ ./application/platforms/ios/Yellr/Resources/icons/;
	cp -r ./src/app/splash-screens/ios/ ./application/platforms/ios/Yellr/Resources/splash/;
	# show zcode project
	open application/platforms/ios;

	# feedback
	clear; echo; echo iOS build complete.; echo;



android:
	cd application; cordova platform add android;
	# copy app icons and splash screens
	cp -r ./src/app/icons/android/ ./application/platforms/android/res/
	cp -r ./src/app/splash-screens/android/ ./application/platforms/android/res/
	# build it
	cd application; cordova build android;

	# feddback
	clear; echo; echo Android build complete.; echo;


server:
	cd build; echo; echo Live link: http://127.0.0.1:8000; echo; python -m SimpleHTTPServer;