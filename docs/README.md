yellr docs
-------------

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


