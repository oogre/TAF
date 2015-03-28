"use strict";
/*global Meteor : false */

Meteor.startup(function () {
	Meteor.mobileServer = "http://ogre.local:3000";
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

