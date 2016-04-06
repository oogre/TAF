(function(){"use strict";
/*global Meteor : false */
/*global Tracker : false */
/*global Session : false */

Meteor.startup(function () {
	Tracker.autorun(function () {
		if(Meteor.status().connected && (Meteor.loggingIn() || Meteor.user())){
			Meteor.subscribe("roles");
			Meteor.subscribe("tasks");
			Meteor.subscribe("picts"); 
			Meteor.subscribe("modules");
			Meteor.subscribe("moves", Session.get(Meteor.MOVES_DATE));
			var shops = Meteor.subscribe("shops");
			var worksWikis = Meteor.subscribe("works&wikis", Session.get(Meteor.CALENDAR_CONF).defaultDate);
			var mattersOriginsUnits = Meteor.subscribe("mattersOriginsUnits");
			var workers = Meteor.subscribe("workers");
			if(worksWikis.ready() && shops.ready() && mattersOriginsUnits.ready() && workers.ready()){
				Session.set(Meteor.DATA_RECIEVED, true);
			}
		}
	});
});
}).call(this);
