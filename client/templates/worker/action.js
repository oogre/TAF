"use strict";
/*global Meteor : false */
/*global Template : false */



Template.workeraction.helpers({
	connected : function(){
		return Meteor.status().connected ? "" : "disabled";
	},
	isWorker : function(){
		return Meteor.isWorker();
	},
	isBoss : function(){
		return Meteor.isBoss();
	}
});