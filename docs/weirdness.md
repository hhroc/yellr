
# INSTALL_FAILED_INSUFFICIENT_STORAGE error

https://stackoverflow.com/questions/4709137/solution-to-install-failed-insufficient-storage-error-on-android

Once in a while when you run "cordova run android" it'll spit out an error about insufficient storage.

Quick fix:
- Uninstall the app

Other fix:
- Manually add this: 
	android:installLocation="preferExternal" 
	To the AndroidManifest.xml in application/platforms/android
	as an attribute of the 'manifest' tag