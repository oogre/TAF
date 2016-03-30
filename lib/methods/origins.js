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
			return new Meteor.Error("not authorized", "You have to be a worker");
		}
		if(!Match.test(ref, String)){
			return new Meteor.Error("wrong formatting ref", "Unknow Name : "+ref);
		}
		if(Match.test(ref, Match.Where(function(ref){
			return 	Origins.findOne({
						ref : ref
					});
		}))){
			return new Meteor.Error("non unique ref");
		}
		if(!Match.test(matterId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Matters.findOne(id);
		}))){
			return new Meteor.Error("unknown matter", "You probably type a wrong id : "+id);
		}
		this.unblock();
		
		Origins.insert({
			ref : ref,
			matter : matterId
		});

		return true;
	},
	
	/*
		id : Origins._id
	*/
	originDestroyer : function(originId){
		if (! Meteor.isBoss()) {
			return new Meteor.Error("not authorized", "You have to be a boss");
		}
		this.unblock();
		Origins.remove(originId);
		if(this.isSimulation){
			Session.set("successMessage", "Le conteneur de matériel à été supprimé" );
		}
		return "Le conteneur de matériel à été supprimé";
	}
});