# yellr app

Built with Phonegap (Cordova)

### Process
Build the "build" folder first by running "grunt; grunt deploy"
"grunt" - builds our HTML. compiles our SCSS, and copies our JS
"grunt deploy" - minifies our JS and CSS files

Copy over the js/ and style/ folders into www/

#### DO NOT COPY OVER THE HTML DIRECTLY

The index.html file in the www/ directory holds a bunch of script tags with our Handlebar HTML templates. If you copy over the build/index.html file directly into app/www/index.html you're gonna have a bad time.

Make sure you reference the minified versions of the CSS and JS