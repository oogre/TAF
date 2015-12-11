"use strict";
/*global Works : false */
/*global Meteor : false */
/*global Session : false */
/*global Template : false */


Template.workIndex.helpers({
	works : function(){
		return Session.equals(Meteor.LIST_CALENDAR_SWITCHER, true) ? this.works : Works.find();
	},
	listView : function(){
		return Session.equals(Meteor.LIST_CALENDAR_SWITCHER, true);
	}
});

Template.workIndex.events({
	"click .listCalSwitcher" : function(){
		Session.set(Meteor.LIST_CALENDAR_SWITCHER, !Session.get(Meteor.LIST_CALENDAR_SWITCHER));
		return false;
	}
});
