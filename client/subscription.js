"use strict";
/*global Meteor : false */
/*global Tracker : false */
/*global Session : false */

Meteor.startup(function () {
	Tracker.autorun(function () {
		if(Meteor.loggingIn() || Meteor.user()){
			Meteor.subscribe("shops");
			Meteor.subscribe("roles");
			Meteor.subscribe("tasks");
			Meteor.subscribe("picts"); 
			Meteor.subscribe("modules"); 
			Meteor.subscribe("workers");
			Meteor.subscribe("works&wikis", Session.get(Meteor.CALENDAR_CONF).defaultDate);
			Meteor.subscribe("moves", Session.get(Meteor.MOVES_DATE));
			Meteor.subscribe("mattersOriginsUnits");
		}
	});
});