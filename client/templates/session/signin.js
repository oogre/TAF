"use strict";
/*global Meteor : false */
/*global Router : false */
/*global console : false */
/*global Template : false */


Template.signin.events({
	"submit form": function(event, template){
    	event.preventDefault();
		var emailVar = template.find("#login-email").value;
		var passwordVar = template.find("#login-password").value;
    	Meteor.loginWithPassword(emailVar, passwordVar, function(err){
    		if(err) console.log(err);
    		Router.go("home");
    	});
	}
});