"use strict";
/*global _ : false */
/*global Shops : false */
/*global Meteor : false */
/*global Workers : false */
/*global Wikis : false */
/*global Works : false */


Meteor.methods({
	updateWorker: function (workerid, worker) {
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		return Workers.update(workerid, {$set : {profile : worker}});
	},
	easyShopCreator : function(shop){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		if(!shop.name || !shop.contact){
			return new Meteor.Error("name-contact-minimal-data");
		}	
		return Shops.insert(shop);
	},
	wikiCreator : function(wiki){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		return Wikis.insert(wiki);
	},
	wikiUpdator: function (wikiid, wiki) {
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		if(!wiki.title || !wiki.description){
			return new Meteor.Error("title-description-minimal-data");
		}
		Wikis.update(wikiid, {$set : {title : wiki.title, description : wiki.description }});
		return wikiid;
	},
	wikiDestructor : function(id){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		return Wikis.remove(id);
	},
	workCreator : function(shop, type, rdv, workers, wiki){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		if(_.isArray(rdv)){
			return rdv.map(function(_rdv){
				return Works.insert({
					shop : shop,
					type : type,
					rdv : _rdv,
					worker_ids : workers,
					wiki_id : wiki,
				});
			});
		}
		return Works.insert({
			shop : shop,
			type : type,
			rdv : rdv,
			worker_ids : workers,
			wiki_id : wiki,
		});
	}
});