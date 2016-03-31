"use strict";
/*global $ : false */
/*global Router : false */
/*global Meteor : false */
/*global Origins : false */

Meteor.methods({
	/*
		matterId : Matter._id,
		ref : String uniq
	*/
	originCreator : function(matterId, ref){
		if (! Meteor.isWorker()) {
			throw new Meteor.Error("not authorized", "Vous devez être un Travailleur pour supprimer un conteneur");
		}
		if(!Match.test(ref, String)){
			throw new Meteor.Error("wrong formatting ref", "Ajouter au moins un nom de référence pour ce conteneur");
		}
		var origin = Origins.findOne({
						ref : ref
					});
		if(origin){
			throw new Meteor.Error("non unique ref", "Un conteneur porte déjà ce nom de référence <a href='"+Router.path("origin.show", {originId : origin._id})+"'>Voir</a>");
		}
		if(!Match.test(matterId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Matters.findOne(id);
		}))){
			throw new Meteor.Error("unknown matter", "Le matériel n'existe pas");
		}
		this.unblock();
		
		Origins.insert({
			ref : ref,
			matter : matterId
		});

		if(this.isSimulation){
			Session.set("successMessage", "Le conteneur de matériaux a été créé" );
		}
		return "Le conteneur de matériaux a été créé";
	},
	
	/*
		id : Origins._id
	*/
	originDestroyer : function(originId){
		if (! Meteor.isBoss()) {
			return new Meteor.Error("not authorized", "Vous devez être un Boss pour supprimer un conteneur de matériaux");
		}
		this.unblock();
		Origins.remove(originId);
		if(this.isSimulation){
			Session.set("successMessage", "Le conteneur de matériel à été supprimé" );
		}
		return "Le conteneur de matériel à été supprimé";
	}
});