"use strict";
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
			return new Meteor.Error("not authorized", "You have to be a worker");
		}
		if(!Match.test(data, Object)){
			return new Meteor.Error("wrong formatting object");
		}
		if(!Match.test(data.originId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Origins.findOne(id);
		}))){
			return new Meteor.Error("unknown object.originId", "You probably type a wrong id : "+data.originId);
		}
		if(!Match.test(data.dateTime, Match.Where(function(date){
			return 	moment(date).isValid()
		}))){
			return new Meteor.Error("wrong formatting object.dateTime");
		}
		data.dateTime = moment(data.dateTime).toISOString();
		data.quantity = parseInt(data.quantity);
		if(!Match.test(data.quantity, Match.Integer)){
			return new Meteor.Error("wrong formatting object.quantity");
		}
		if(data.workId && !Match.test(data.workId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Works.findOne(id);
		}))){
			return new Meteor.Error("unknown object.workId", "You probably type a wrong id: "+data.workId);
		}
		if(data.destinyId && !Match.test(data.destinyId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Shops.findOne({
						'modules.0.serial' : id
					}) ||
					Origins.findOne(id)
		}))){
			return new Meteor.Error("unknown object.destinyId", "You probably type a wrong id: "+data.destinyId);
		}

		this.unblock();
		
		Moves.insert({
			workId : data.workId,
			originId : data.originId,
			destinyId : data.destinyId,
			dateTime : data.dateTime,
			quantity : data.quantity
		});
	},
	
	/*
		id : Moves._id
	*/
	moveDestroyer: function (id) {
		if (! Meteor.isBoss()) {
			return new Meteor.Error("not authorized", "You have to be a boss");
		}
		this.unblock();
		Moves.remove(id);
		if(this.isSimulation){
			Session.set("successMessage", "Le transfert à été supprimé" );
		}
		return "Le transfert à été supprimé";
	}
});