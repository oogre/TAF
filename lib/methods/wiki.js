"use strict";
/*global $ : false */
/*global Wikis : false */
/*global Works : false */
/*global moment : false */
/*global Meteor : false */
/*global global : false */


Meteor.methods({
	wikiCreator : function(workId, wiki){
		if (!Meteor.isWorker()) {
			throw new Meteor.Error("not authorized", "Vous devez être un Travailleur pour créer un wiki");
		}
		if(!Match.test(workId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Works.findOne(id);
		}))){
			throw new Meteor.Error("unknown shop", "Le travaille que vous voulez modifier n'existe pas");
		}
		if(!Match.test(wiki, Object)){
			throw new Meteor.Error("wrong formatting object", "Aucune donnée reçue");
		}

		if(!Match.test(wiki.description, String)){
			throw new Meteor.Error("wrong formatting object", "Ajouter au moins une description pour ce wiki");
		}

		// this.unblock();
		
		var currentWiki = Wikis.insert({
			createdAt : moment().toISOString(),
			description : wiki.description,
			linkTo : {
				collection : "Works",
				_id : workId
			}
		});

		Works.update(workId, {
			$push : {
				wikis : currentWiki
			}
		});

		if(this.isSimulation){
			$("textarea").val("");
			Session.set("successMessage", "Vous avez créé un wiki pour ce travail" );
		}
		return "Vous avez créé un wiki pour ce travail";
	},
	wikiDestroyer : function(id){
		if (! Meteor.isBoss()) {
			throw new Meteor.Error("not authorized", "Vous devez être un Boss pour supprimer un wiki");
		}
		var wiki = Wikis.findOne(id);
		if(!Match.test(id, Match.Where(function(id){
			return 	Match.test(id, String) &&
					wiki;
		}))){
			throw new Meteor.Error("unknown shop", "Le wiki que vous voulez supprimer n'existe pas");
		}
		// this.unblock();

		if(wiki.linkTo && wiki.linkTo._id && wiki.linkTo.collection){
			var Collection = this.isSimumation ? window[wiki.linkTo.collection] : global[wiki.linkTo.collection];
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

if ( Meteor.isClient ) {
	Ground.methodResume([
		"wikiCreator",
		"wikiDestroyer"
	]);
}