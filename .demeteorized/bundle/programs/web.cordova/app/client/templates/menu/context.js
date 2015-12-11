(function(){
"use strict";
/*global Meteor : false */
/*global Session : false */
/*global Template : false */


Template.contextmenu.events({
	"click a": function() {
		Session.set(Meteor.CONTEXT_MENU_KEY, false);
	}
});
}).call(this);
