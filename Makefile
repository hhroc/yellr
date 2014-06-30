client:
	cd ./src/client; npm install; bundle install; cd ../..;

server:
	cd build; python -m SimpleHTTPServer;

ios:
	cordova create app com.hhroc.yellr "Yellr";
	cp -r www app;
	cd app; cordova platform add ios; cordova build ios;
