"use strict";
/*global $ : false */
/*global Wikis : false */
/*global Works : false */
/*global moment : false */
/*global Meteor : false */
/*global global : false */


Meteor.methods({
	wikiCreator : function(workId, wiki){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		if(!wiki.description){
			return;
		}
		var currentWiki = Wikis.insert({
			createdAt : moment().toISOString(),
			description : wiki.description,
			linkTo : {
				collection : "Works",
				_id : workId
			}
		});
		if(workId){
			Works.update(workId, {
				$push : {
					wikis : currentWiki
				}
			});
		}
		if(this.isSimulation){
			$("textarea").val("");
		}
		return currentWiki;
	},
	wikiDestroyer : function(id){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();

		var wiki = Wikis.findOne(id);
		if(!wiki){
			return false;
		}
		if(wiki.linkTo && wiki.linkTo._id && wiki.linkTo.collection){

			var Collection;
			if(Meteor.isClient){
				Collection = window[wiki.linkTo.collection];	
			} 
			else{
			 Collection = global[wiki.linkTo.collection];
			}

			Collection
			.update(wiki.linkTo._id, {
				$pull : {
					wikis : id
				}
			});
		}
		Wikis.remove(id);
		if(Meteor.isSimulation){
			Session.set("successMessage", "Le wiki à été supprimé" );
		}
		return "Le wiki à été supprimé";
	}
});