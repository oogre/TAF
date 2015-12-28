"use strict";
/*global Meteor : false */
/*global Router : false */
/*global console : false */
/*global Template : false */


Template.signin.events({
	"submit form": function(event, template){
		Session.set(Meteor.USER_ERROR, false);
		Session.set(Meteor.PWD_ERROR, false);
		event.preventDefault();
		var emailVar = template.find("#login-email").value;
		var passwordVar = template.find("#login-password").value;
		Meteor.loginWithPassword(emailVar, passwordVar, function(err){
			if(err){
				if(err.reason.match("User")){
					Session.set(Meteor.USER_ERROR, true);
				}
				if(err.reason.match("password"))
					Session.set(Meteor.PWD_ERROR, true);
				return ;
			}
			Router.go("home");
		});
	}
});

Template.signin.helpers({
	pwdErr : function(){
		return Session.equals(Meteor.PWD_ERROR, true) && "has-error has-feedback";
	},
	userErr : function(){
		return Session.equals(Meteor.USER_ERROR, true) && "has-error has-feedback";
	}
});

Template.signin.destroyed = function(){
	Session.set(Meteor.USER_ERROR, false);
	Session.set(Meteor.PWD_ERROR, false);
}