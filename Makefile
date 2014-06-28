client:
	cd ./src/client; npm install; bundle install; cd ../..;

server:
	cd build; python -m SimpleHTTPServer;
