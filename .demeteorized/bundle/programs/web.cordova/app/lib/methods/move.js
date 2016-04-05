(function(){"use strict";
/*global $ : false */
/*global Router : false */
/*global Meteor : false */
/*global Moves : false */

Meteor.methods({
	/*
		data : {
			originId : Origins._id,
			dateTime : ISOString,
			quantity : Interger,
			workId : undefined || null || Works._id,
			destinyId : undefined || null || Shops.modules.0.serial || Origins._id,
		}
	*/
	moveCreator : function(data){
		if (! Meteor.isWorker()) {
			throw new Meteor.Error("not authorized", "Vous devez être un Travailleur pour créer un transfert de matériel");
		}
		if(!Match.test(data, Object)){
			throw new Meteor.Error("wrong formatting object", "Aucune donnée reçue");
		}
		if(!Match.test(data.originId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Origins.findOne(id);
		}))){
			throw new Meteor.Error("unknown object.originId", "Le conteneur d'origine n'existe pas");
		}
		if(!Match.test(data.dateTime, Match.Where(function(date){
			return 	moment(date).isValid()
		}))){
			throw new Meteor.Error("wrong formatting object.dateTime", "Le date transmise est incompréhanssible : "+data.dateTime);
		}
		data.dateTime = moment(data.dateTime).toISOString();
		data.quantity = parseInt(data.quantity);
		if(!Match.test(data.quantity, Match.Integer)){
			throw new Meteor.Error("wrong formatting object.quantity", "La quantité du transfert est incompréhanssible");
		}
		if(data.workId && !Match.test(data.workId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Works.findOne(id);
		}))){
			throw new Meteor.Error("unknown object.workId", "Le travail donnant lieu à ce transfert de matériaux n'existe pas");
		}
		if(data.destinyId && !Match.test(data.destinyId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Shops.findOne({
						'modules.0.serial' : id
					}) ||
					Origins.findOne(id)
		}))){
			throw new Meteor.Error("unknown object.destinyId", "Le conteneur de destination n'existe pas");
		}

		this.unblock();
		
		Moves.insert({
			workId : data.workId,
			originId : data.originId,
			destinyId : data.destinyId,
			dateTime : data.dateTime,
			quantity : data.quantity
		});
		if(this.isSimulation){
			Session.set("successMessage", "Le transfert de matériaux a été archivé" );
		}
		return "Le transfert de matériaux a été archivé";
	},
	
	/*
		id : Moves._id
	*/
	moveDestroyer: function (id) {
		if (! Meteor.isBoss()) {
			return new Meteor.Error("not authorized", "Vous devez être un Boss pour supprimer un transfert de matériaux");
		}
		this.unblock();
		Moves.remove(id);
		if(this.isSimulation){
			Session.set("successMessage", "Le transfert à été supprimé" );
		}
		return "Le transfert à été supprimé";
	}
});
}).call(this);
