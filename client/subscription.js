"use strict";
/*global Meteor : false */
/*global Tracker : false */
/*global Session : false */

Meteor.startup(function () {
	Tracker.autorun(function () {
		Meteor.subscribe("shops");
		Meteor.subscribe("workers");
		Meteor.subscribe("roles");
		Meteor.subscribe("tasks");
		Meteor.subscribe("modules"); 
		Meteor.subscribe("matters&units");
		Meteor.subscribe("works&wikis", Session.get(Meteor.CALENDAR_CONF).defaultDate);
	});
});