(function(){"use strict";
/*global Meteor : false */
/*global Accounts : false */

Meteor.startup(function () {
	Accounts.ui.config({
		passwordSignupFields: "USERNAME_ONLY"
	});
});


}).call(this);
