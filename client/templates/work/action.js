"use strict";
/*global Meteor : false */
/*global Template : false */

Template["work-action"].helpers({
	depannageVisible : function(){
		return Meteor.user() && Meteor.user().profile.role >= 60;
	},
	installationVisible : function(){
		return Meteor.user() && Meteor.user().profile.role >= 90;
	},
	maintenanceVisible : function(){
		return Meteor.user() && Meteor.user().profile.role >= 90;
	}
});