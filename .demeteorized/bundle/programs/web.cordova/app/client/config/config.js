(function(){"use strict";
/*global Meteor : false */

Meteor.startup(function () {
	Meteor.pictureUploadServer = "http://taf.ogre.be/upload";//http://localhost:3000/upload";//"http://192.168.1.42:3000";//"http://taf.ogre.be";taf.ogre.be
	Meteor.pictureServer = "http://tafpict.ogre.be";//http://localhost:3000/upload" ;
	moment.locale('fr');
});

Meteor.QG = {
	location: {
		lat: 50.6797964,
		lng: 5.532689
	}
};
Meteor.indexLimit = 10;
Meteor.indexSkip = 0;


}).call(this);
