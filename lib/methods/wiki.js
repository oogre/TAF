"use strict";
/*global _ : false */
/*global Wikis : false */
/*global Works : false */
/*global moment : false */
/*global Session : false */
/*global Meteor : false */


Meteor.methods({
	wikiCreator : function(workId){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		var currentWiki = Wikis.insert({
			createdAt : moment().toISOString(),
			uploads: [], 
			description:""
		});
		if(workId){
			Works.update(workId, {
				$push : {
					wiki_id : currentWiki
				}
			});
		}
		if(this.isSimulation){
			Session.set(Meteor.WIKI_CURRENT_KEY, currentWiki);
		}
		return currentWiki;
	},
	wikiUpdator: function (wikiid, wiki) {
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		Wikis.update(wikiid, {
			$set : wiki
		});
		return wikiid;
	},
	wikiUploadUpdator: function (wikiid, uploads) {
		this.unblock();
		var raw = _.isString(uploads) || (Wikis.findOne(wikiid) && (true === Wikis.findOne(wikiid).raw));
		Wikis.update({_id: wikiid}, { 
			$push: { 
				uploads: uploads 
			},
			$set : {
				raw : raw
			} 
		});
		return wikiid;
	},
	wikiDestructor : function(id){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		return Wikis.remove(id);
	}
});