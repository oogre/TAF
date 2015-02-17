"use strict";
/*global Meteor : false */

Meteor.startup(function () {
	Meteor.call("serverIP", function(err, data){
		Meteor.serverIP = data;
	});
});