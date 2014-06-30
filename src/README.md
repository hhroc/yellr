# yellr source

client/
	- holds our Grunt installation
	- has all the main CSS styles, JS, and markup
server/
	- Python server code
www/
	- holds the code which is copied to the app/www directory
	- index.html must be manually editted
	- all other folders and files are built from the client dir


The markup, styles, and events are all housed in src/client/. The majority of front-end and app edits should be done from this directory.
From the client directory run 'grunt watch' to rebuild the project after file changes.
$ cd src/client
$ grunt watch


Grunt will build the project files into a build/ folder at the top directory.

build/ holds a single html file that has all the mark-up and styles applied. That html file is then cut up and used accordingly for templates used by the website and app.