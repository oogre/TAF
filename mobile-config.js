"use strict";
/*global App : false */


// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
	id: "com.example.GDUTAF",
	name: "TAF",
	description: "Gestion DU Travail à l'Atelier du Froid",
	author: "Vincent Evrard",
	email: "vincent@ogre.be",
	website: "http://ogre.be"
});
 
// Set up resources such as icons and launch screens.
App.icons({
	"android_ldpi": "public/icons/icon-36x36.png",
	"android_mdpi": "public/icons/icon-48x48.png",
	"android_hdpi": "public/icons/icon-72x72.png",
	"android_xhdpi": "public/icons/icon-96x96.png"
});

App.launchScreens({
	"android_hdpi_portrait": "public/splash/splash-480x800.jpg",
	"android_xhdpi_portrait": "public/splash/splash-720x1280.jpg"
});

// Set PhoneGap/Cordova preferences
App.setPreference("BackgroundColor", "0xff0000ff");
App.setPreference("HideKeyboardFormAccessoryBar", true);
App.setPreference("DisallowOverscroll", true);
App.setPreference("Orientation", "portrait");