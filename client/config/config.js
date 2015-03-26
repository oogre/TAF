"use strict";
/*global Meteor : false */

Meteor.startup(function () {
	Meteor.call("getServerIp", function(err, data){
		if(err || !data){
			Meteor.serverIP = "";	
		}else{
			Meteor.serverIP = "http://"+data+":3000";
		}
	});
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

