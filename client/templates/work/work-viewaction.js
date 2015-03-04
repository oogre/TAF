"use strict";
/*global Meteor : false */
/*global Template : false */

Template["work-viewaction"].helpers({
	removeVisible : function(){
		return !this.end && Meteor.user().profile.role >= 90;
	}
});