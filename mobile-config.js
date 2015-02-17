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
 /*
// Set up resources such as icons and launch screens.
App.icons({
  "iphone": "icons/icon-60.png",
  "iphone_2x": "icons/icon-60@2x.png",
  // ... more screen sizes and platforms ...
});
 
App.launchScreens({
  "iphone": "splash/Default~iphone.png",
  "iphone_2x": "splash/Default@2x~iphone.png",
  // ... more screen sizes and platforms ...
});
 */
// Set PhoneGap/Cordova preferences
App.setPreference("BackgroundColor", "0xff0000ff");
App.setPreference("HideKeyboardFormAccessoryBar", true);
App.setPreference("DisallowOverscroll", true);
App.setPreference("Orientation", "portrait");