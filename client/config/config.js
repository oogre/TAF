"use strict";
/*global Meteor : false */

Meteor.startup(function () {
	Meteor.pictureUploadServer = Meteor.absoluteUrl()+"/upload";//http://localhost:3000/upload";//"http://192.168.1.42:3000";//"http://taf.ogre.be";taf.ogre.be
	Meteor.pictureServer = "http://localhost:3000/upload";//http://localhost:3000/upload" ;http://tafpict.ogre.be
	moment.locale('fr');

	Meteor.setInterval(function(){
		Meteor.reconnect();	
	}, 3000);
});

Meteor.QG = {
	location: {
		lat: 50.6797964,
		lng: 5.532689
	}
};
Meteor.indexLimit = 10;
Meteor.indexSkip = 0;

