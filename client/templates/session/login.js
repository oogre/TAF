"use strict";
/*global Template : false */
/*global Meteor : false */


Template.signin.events({
	"submit form": function(event, template){
    	event.preventDefault();
		var emailVar = template.find("#login-email").value;
		var passwordVar = template.find("#login-password").value;
    	Meteor.loginWithPassword(emailVar, passwordVar);
	}
});