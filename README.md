# yellr

Citizen Journalism Mobile App, Website, and Eco-System


### Getting started

##### Make sure npm is installed/up to date
$ npm update npm -g

##### Make sure RubyGems is installed/up to date
$ gem update --system

##### Make sure Cordova is installed
$ npm install -g cordova


##### Download the repo
$ git clone https://github.com/hhroc/yellr.git

##### Change into the repo directory
$ cd yellr

##### Make the thing (run the make file)
$ make init

##### You should now see a build/ folder at the top-level directory
You can run a server with:
$ make server
(Optionally you could just 'cd' into the build/ folder and run a simple python server yourself. 'make server' is there for convenience)

##### You should also see an app/folder at the same top-level.

##### Cordova requires the SDK of each target platform to be installed
For Android:
-	https://cordova.apache.org/docs/en/3.0.0/guide_platforms_android_index.md.html#Android%20Platform%20Guide
For iOS:
-	https://cordova.apache.org/docs/en/3.0.0/guide_platforms_ios_index.md.html#iOS%20Platform%20Guide	


##### To build the Android app:
$ make android
##### To build the iOS app:
$ make ios



### The Lay of the Land

Under the hood the front-end and app is all HTML, CSS, and JS. Phonegap (Cordova) is used to deploy to various mobile platforms. Because the entire front-end and app is built with the same mark-up, styles, and events we make use of Grunt.js to handle:
- compiling sass files, jade templates
- minifying everything
- writing everything once (as much as possible)

##### Making a change

Editing content in the src/ folder will build to build/ folder.

To see the workflow, open up src/client/index.jade and src/client/style/style.scss in a text editor.

Run 'grunt watch' from the src/ folder so that Grunt can run everytime a file changes
$ cd src
$ grunt watch

Make a change to either file:
Ex. Change the text in any part of the .jade file
Ex. Set the background of something to 'tomato'

Each time you save a file change, grunt runs specific tasks.
In our case it would re-compile the jade into html, and our sass into css.
Checkout the Gruntfile.js in src/ to see what Grunt is actually doing.

The index page contains the pieces of the Yellr project.
It is meant to be a general purpose sandbox for development.

Check out the src/ folder for more details on how to contribute.
Check out the docs/ folder for more details on project setup.









##### Current state
Screenshots of current development stage:
https://imgur.com/a/En3xT
