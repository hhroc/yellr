init:
	# install grunt, gems, then build
	cd ./src/client; npm install; grunt;
	# cd ./src/client; npm install; bundle install; grunt; cd ../..;

	# build the app
	cordova create app com.hhroc.yellr "Yellr";
	cp -r src/www app;
	# add all cordova plugins. check the docs for a detailed list
	cd app; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-device.git;
	cd app; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-network-information.git;
	cd app; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-battery-status.git;
	cd app; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-geolocation.git;
	cd app; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-camera.git;
	cd app; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-media-capture.git;
	cd app; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-media.git;
	cd app; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-file.git;
	cd app; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-file-transfer.git;
	cd app; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-dialogs.git;
	cd app; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-vibration.git;
	cd app; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-globalization.git;
	cd app; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-splashscreen.git;
	cd app; cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-console.git;


ios:
	cd app; cordova platform add ios; cordova build ios;
android:
	cd app; cordova platform add android; cordova build android;


server:
	cd build; echo; echo Live link: http://127.0.0.1:8000; echo; python -m SimpleHTTPServer;