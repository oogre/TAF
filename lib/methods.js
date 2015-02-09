"use strict";
/*global _ : false */
/*global Shops : false */
/*global Meteor : false */
/*global Workers : false */
/*global Wikis : false */
/*global Works : false */


Meteor.methods({
	workerUpdator: function (workerid, worker) {
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
					wiki_ids : wiki?[wiki] : [],
				});
			});
		}
		return Works.insert({
			shop : shop,
			type : type,
			rdv : rdv,
			worker_ids : workers,
			wiki_id : wiki,
			schedular : {}
		});
	},
	workAddWorker : function(workId, workerId){
		var works = Works.findOne(workId);
		return Works.update(workId, {
			$set : {
				worker_ids : (works.worker_ids||[]).concat(workerId)
			}
		});
	},
	workerSchedule : function( workId, workerId, action, datetime){
		console.log("TODO : methods (workerSchedule) - WORKS FILERING");
		Works.find().fetch().map(function(work){
			var schedular = work.schedular || {};
			schedular[workerId] = schedular[workerId] || [];
			schedular[workerId] =	schedular[workerId]
									.map(function(schedule){
										schedule.stop = schedule.stop || datetime;
										return schedule;
									});
			Works.update(work._id, {$set : {schedular : schedular}});
		});
		
		var work = Works.findOne(workId);
		var schedular = work.schedular || {};
		schedular[workerId] = schedular[workerId] || [];
		if(action === "start"){
			schedular[workerId].push({
				start : datetime
			});
		}
		return Works.update(workId, {$set : {schedular : schedular}});
	}
});