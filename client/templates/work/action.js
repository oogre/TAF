"use strict";
/*global Meteor : false */
/*global Template : false */

Template["work-action"].helpers({
	isWorker : function(){
		return Meteor.isWorker();
	},
	isBoss : function(){
		return Meteor.isBoss();
	}
});