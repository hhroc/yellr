# yellr
Citizen Journalism Mobile App, Website, and Eco-System



## Getting started

### Prereqs
##### Requires [npm](https://www.npmjs.org/)
```
$ npm update npm -g         # make sure npm is installed/up to date
$ gem update --system       # make sure RubyGems is installed/up to date
$ npm install -g cordova    # make sure Cordova is installed
```


### The Real Deal
```
$ git clone https://github.com/hhroc/yellr.git
$ cd yellr
$ make init
```




## Seeing Each Part
You will now see a build/ folder at the root-level of the project. This holds all the HTML, CSS, and JS that Yellr runs with for the front-end, moderator, and public site.


#### Moderator and Public Feed
You can run a local server to view the project (although optional)
```
$ pwd
yellr/
$ cd build
$ python -m SimpleHTTPServer
```
Optional if you are in the project root you can run this command to accomplish the same
```
$ make server
```


#### Mobile Application
You will also see an app/ folder in the build/ directory. This is not where the actual application code lives. The Cordova application lives in the __application__ folder of the project.

```
$ pwd
yellr/
$ cd application/
```
Because Cordova uses HTML/CSS/JS to build the application we can debug our code using the browser. More on this in the docs.

##### Cordova requires the SDK of each target platform to be installed
For Android: [Android Guide](https://cordova.apache.org/docs/en/3.0.0/guide_platforms_android_index.md.html#Android%20Platform%20Guide)
For iOS: [iOS Guide](https://cordova.apache.org/docs/en/3.0.0/guide_platforms_ios_index.md.html#iOS%20Platform%20Guide)
```
$ make android      # build android application
$ make ios          # build ios application
```



#### Web Server
The backend server that powers the mobile app and backend is built with Python using Pyramid
##### Create your virtualenv
```
(virtualenv)$ pwd
yellr/
(virtualenv)$ cd src/server/yellr-serv
(virtualenv)$ python setup.py develop
(virtualenv)$ initialize_yellr-serv_db development.ini
(virtualenv)$ pserve development.ini
```





## Contributing
Check out the __docs__ folder for most of the stuff. An example of how to contribute to each section is laid out in the docs.





##### Current state
Screenshots of current development stage:
https://imgur.com/a/En3xT
