"use strict";
/*global Meteor : false */

Meteor.startup(function () {
	Meteor.pictureUploadServer = "http://taf.ogre.be/upload";//"http://192.168.1.42:3000";//"http://taf.ogre.be";
	Meteor.pictureServer = "http://tafpict.ogre.be/" ;//Meteor.server+"/upload";//"";
});

Meteor.QG = {
	location: {
		lat: 50.6797964,
		lng: 5.532689
	}
};

Meteor.google = {
	keys : "AIzaSyBJeMgB6UgQgrVBSHDkRc1c6533odymHJM"
};

Meteor.indexLimit = 10;
Meteor.indexSkip = 0;

