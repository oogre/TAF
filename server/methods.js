"use strict";
/*global Shops : false */
/*global Meteor : false */
/*global Workers : false */

Meteor.methods({
	updateWorker: function (workerid, worker, next) {
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			return next(new Meteor.Error("not-authorized"));
		}
		Workers.update(workerid, {$set : {profile : worker}}, next);
	},
	easyShopCreator : function(shop, next){
		if (! Meteor.userId()) {
			return next(new Meteor.Error("not-authorized"));
		}
		if(!shop.name || !shop.contact){
			return next(new Meteor.Error("name-contact-minimal-data"));
		}	
		Shops.insert(shop, next);
	}
});

//