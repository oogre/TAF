"use strict";
/*global Meteor : false */
/*global Template : false */

Template["work-action"].helpers({
	depannageVisible : function(){
		return Meteor.isWorker();
	},
	installationVisible : function(){
		return Meteor.isBoss();
	},
	maintenanceVisible : function(){
		return Meteor.isBoss();
	}
});