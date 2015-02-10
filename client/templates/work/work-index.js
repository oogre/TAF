"use strict";
/*global Template : false */
/*global Session : false */
/*global Meteor : false */
/*global Works : false */


Template["work-index"].helpers({
	works : function(){
		return Works.find();
	},
	listView : function(){
		return Session.get(Meteor.LIST_CALENDAR_SWITCHER);
	}
});

Template["work-index"].events({
	"click .listCalSwitcher" : function(){
		Session.set(Meteor.LIST_CALENDAR_SWITCHER, !Session.get(Meteor.LIST_CALENDAR_SWITCHER));
		return false;
	}
});
