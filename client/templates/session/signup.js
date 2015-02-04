"use strict";
/*global Template : false */
/*global Accounts : false */
/*global Meteor : false */


Template.signup.events({
	"submit form": function(event, template){
		event.preventDefault();
		var emailVar = template.find("#register-email").value;
		var passwordVar = template.find("#register-password").value;
		var reTypePasswordVar = template.find("#register-retype-password").value;

		if(reTypePasswordVar === passwordVar){
			Accounts.createUser({
				email: emailVar,
				password: passwordVar
			});
		}else{
			throw new Meteor.Error(403, "Username must have at least 3 characters");
		}
        return false;
    }
});