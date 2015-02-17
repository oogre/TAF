"use strict";
/*global Accounts : false */
/*global Meteor : false */
Meteor.startup(function () {
	Accounts.ui.config({
		passwordSignupFields: "USERNAME_ONLY"
	});
});

