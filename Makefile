init:
	# install grunt, gems, then build
	cd ./src/frontend; npm install; grunt;
	# cd ./src/client; npm install; bundle install; grunt; cd ../..;

	# build the app
	cordova create application com.hhroc.yellr "Yellr";
	cp -r src/app/ application/;
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


ios:
	cd application; cordova platform add ios; cordova build ios;
android:
	cd application; cordova platform add android; cordova build android;


server:
	cd build; echo; echo Live link: http://127.0.0.1:8000; echo; python -m SimpleHTTPServer;