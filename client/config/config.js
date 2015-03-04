"use strict";
/*global Meteor : false */

Meteor.startup(function () {
	Meteor.call("serverIP", function(err, data){
		Meteor.serverIP = data;
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