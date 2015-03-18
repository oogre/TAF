"use strict";
/*global Meteor : false */

Meteor.isAdmin = function(){
	return Meteor.user() && Meteor.user().profile && Meteor.user().profile.role >= 100;
};
Meteor.isBoss = function(){
	return Meteor.user() && Meteor.user().profile && Meteor.user().profile.role >= 90;
};
Meteor.isChief = function(){
	return Meteor.user() && Meteor.user().profile && Meteor.user().profile.role >= 80;
};
Meteor.isWorker = function(){
	return Meteor.user() && Meteor.user().profile && Meteor.user().profile.role >= 70;
};
Meteor.isVisitor = function(){
	return Meteor.user() && Meteor.user().profile && Meteor.user().profile.role >= 60;	
};