"use strict";
/*global _ : false */
/*global $ : false */
/*global Shops : false */
/*global Router : false */
/*global Meteor : false */
/*global Modules : false */




Meteor.methods({
	/*
		shop : { 
			name: String uniq, 
			contacts: [String]
		}
	*/
	easyShopCreator : function(shop){
		if (!Meteor.isWorker()) {
			throw new Meteor.Error("not authorized", "Vous devez être un Travailleur pour créer un client");
		}
		if(!Match.test(shop, Object)){
			throw new Meteor.Error("wrong formatting object", "Aucune donnée reçue");
		}
		if(!Match.test(shop.name, String)){
			throw new Meteor.Error("wrong formatting object.name", "Ajouter au moins un nom pour ce client");
		}
		shop.name = shop.name.toLowerCase();
		var _shop = Shops.findOne({
						name : shop.name
					})
		if(_shop){
			throw new Meteor.Error("non unique shop.name", "Un client porte déjà ce nom <a href='"+Router.path("shop.view", {id : _shop._id})+"'>Voir</a>");
		}
		if(!Match.test(shop.contacts, [String])){
			throw new Meteor.Error("wrong formatting object.contacts", "Ajouter au moins un contact");
		}
		// this.unblock();
		return Shops.insert(shop);
	},

	/*
		shop : { 
			name: String uniq, 
			brand: String, 
			contacts: [String],
			address: {
				street: String, 
				number: String,
				city : String,
				zipcode : String
			} 
		},
		button : cssSelector
	*/
	shopCreator : function(shop, button){
		if (! Meteor.isChief()) {
			throw new Meteor.Error("not authorized", "Vous devez être un chef pour créer un client");
		}
		if(!Match.test(shop, Object) || _.isEmpty(shop)){
			throw new Meteor.Error("wrong formatting object", "Aucune donnée reçue");
		}
		if(!Match.test(shop.name, String) || _.isEmpty(shop.name)){
			throw new Meteor.Error("wrong formatting object.name", "Ajouter au moins un nom pour ce client");
		}
		if(!Match.test(shop.brand, String) || _.isEmpty(shop.brand)){
			throw new Meteor.Error("wrong formatting object.brand", "Ajouter au moins un nom d'enseigne pour ce client");
		}
		shop.name = shop.name.toLowerCase();
		if(Match.test(shop.name, Match.Where(function(name){
			return 	Shops.findOne({
						name : name
					});
		}))){
			var shop = Shops.findOne({
						name : shop.name
					});
			throw new Meteor.Error("non unique shop.name", "Un client porte déjà ce nom <a href='"+Router.path("shop.view", {id : shop._id})+"'>Voir</a>");
		}
		if(!Match.test(shop.address, Match.Where(function(address){
			return 	Match.test(address, Object) &&
					Match.test(address, Match.ObjectIncluding({
						street: String, 
						number: String,
						city : String,
						zipcode : String
					})) &&
					!_.isEmpty(address.street) &&
					!_.isEmpty(address.number) &&
					!_.isEmpty(address.city) &&
					!_.isEmpty(address.zipcode)
		}))){
			throw new Meteor.Error("wrong formatting object.address", "L'adresse est incomplète");
		}
		if(!Match.test(shop.contacts, Match.Where(function(contact){
			return 	Match.test(contact, [String]) &&
					contact.length>0
		}))){
			throw new Meteor.Error("wrong formatting object.contacts", "Ajouter au moins un contact");
		}
		// this.unblock();
		
		var address = shop.address.street+" "+shop.address.number+" "+shop.address.city+" "+shop.address.zipcode;
		
		var shopId = Shops.insert(shop);

		Meteor.getLocationInfo(address, function(err, locationInfo){
			if(err) throw err;
			Shops.update(shopId, {
				$set : locationInfo
			});
		});

		if(this.isSimulation && button){
			$(button)
			.removeClass("btn-primary")
			.removeClass("btn-danger")
			.addClass("btn-success");
			Router.go("shop.index");
			Session.set("successMessage", "Le client à été ajouter : <a class='btn btn-lg btn-link' href='"+Router.path("shop.view", {id : shopId})+"'>Voir</a>" );
		}
		return shopId;
	},

	/*
		id : Shops._id
	*/
	shopDestroyer: function (id) {
		if (! Meteor.isBoss()) {
			throw new Meteor.Error("not authorized", "Vous devez être un Boss pour supprimer un client");
		}
		// this.unblock();
		Shops.remove(id);
		if(this.isSimulation){
			Session.set("successMessage", "Le client à été supprimé" );
		}
		return "Le client à été supprimé";
	},

	/*
		shopId : Shops._id,
		shop : { 
			name: String uniq, 
			brand: String, 
			contacts: [String],
			address: {
				street: String, 
				number: String,
				city : String,
				zipcode : String
			} 
		},
		button : cssSelector
	*/
	shopUpdator : function(shopId, shop, button){
		if (! Meteor.isChief()) {
			throw new Meteor.Error("not authorized", "Vous devez être un chef pour modifier un client");
		}
		if(!Match.test(shopId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Shops.findOne(id);
		}))){
			throw new Meteor.Error("unknown shop", "Le client que vous voulez modifier n'existe pas");
		}
		if(!Match.test(shop, Object) || _.isEmpty(shop)){
			throw new Meteor.Error("wrong formatting object", "Aucune donnée reçue");
		}
		if(!Match.test(shop.name, String) || _.isEmpty(shop.name)){
			throw new Meteor.Error("wrong formatting object.name", "Ajouter au moins un nom pour ce client");
		}
		if(!Match.test(shop.brand, String) || _.isEmpty(shop.brand)){
			throw new Meteor.Error("wrong formatting object.brand", "Ajouter au moins un nom d'enseigne pour ce client");
		}
		

		shop.name = shop.name.toLowerCase();
		if(Match.test(shop.name, Match.Where(function(name){
			return 	Shops.findOne({
						_id : {
							$ne : shopId
						},
						name : name
					});
		}))){
			var shop = Shops.findOne({
						_id : {
							$ne : shopId
						},
						name : shop.name
					});
			throw new Meteor.Error("non unique shop.name", "Un client porte déjà ce nom <a href='"+Router.path("shop.view", {id : shop._id})+"'>Voir</a>");
		}
		if(!Match.test(shop.address, Match.Where(function(address){
			return 	Match.test(address, Object) &&
					Match.test(address, Match.ObjectIncluding({
						street: String, 
						number: String,
						city : String,
						zipcode : String
					})) &&
					!_.isEmpty(address.street) &&
					!_.isEmpty(address.number) &&
					!_.isEmpty(address.city) &&
					!_.isEmpty(address.zipcode)
		}))){
			throw new Meteor.Error("wrong formatting object.address", "L'adresse est incomplète");
		}
		if(!Match.test(shop.contacts, Match.Where(function(contact){
			return 	Match.test(contact, [String]) &&
					contact.length>0
		}))){
			throw new Meteor.Error("wrong formatting object.contacts", "Ajouter au moins un contact");
		}

		// this.unblock();

		Shops.update(shopId, shop);

		var address = shop.address.street+" "+shop.address.number+" "+shop.address.city+" "+shop.address.zipcode;

		Meteor.getLocationInfo(address, function(err, locationInfo){
			if(err) throw err;
			Shops.update(shopId, {
				$set : locationInfo
			});
		});

		if(this.isSimulation){
			$(button)
			.removeClass("btn-primary")
			.removeClass("btn-danger")
			.addClass("btn-success");
			Router.go("shop.index");
			Session.set("successMessage", "Le client à été modifier : <a class='btn btn-lg btn-link' href='"+Router.path("shop.view", {id : shopId})+"'>Voir</a>" );
		}
		return shopId;
	},

	/*
		shopId : Shops._id,
		moduleId : Modules._id
	*/
	shopAddModule : function(shopId, moduleId){
		if (! Meteor.isBoss()) {
			throw new Meteor.Error("not authorized", "Vous devez être un Boss pour lier un module à un client");
		}
		if(!Match.test(shopId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Shops.findOne(id);
		}))){
			throw new Meteor.Error("unknown shop", "Le client que vous voulez modifier n'existe pas");
		}
		if(!Match.test(moduleId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Modules.findOne(id);
		}))){
			throw new Meteor.Error("unknown module", "Le module que vous voulez ajouter au client n'existe pas");
		}

		Shops.update(shopId, {
			$push : {
				modules : Modules.findOne(moduleId)
			}
		});
		if(this.isSimulation){
			Session.set("successMessage", "Vous avez ajouter un module à ce client" );
		}
		return "Vous avez ajouter un module à ce client";
	},

	/*
		shopId : Shops._id,
		key : module position in the array owned by the shop
		serial : uniq String
	*/
	shopModuleSetSerial : function(shopId, key, serial){
		if (! Meteor.isBoss()) {
			throw new Meteor.Error("not authorized", "Vous devez être un Boss pour lier un module à un client");
		}

		if(!Match.test(shopId, String) || _.isEmpty(shopId)){
			throw new Meteor.Error("wrong formatting object", "Aucune donnée relative au client reçue");
		}
		
		var shop = Shops.findOne(shopId);
		if(!shop){
			throw new Meteor.Error("unknown shop", "Le client que vous voulez modifier n'existe pas");
		}

		if(!Match.test(key, Match.Where(function(key){
			return 	Match.test(key, Match.Integer) &&
					Match.test(shop.modules, [Object]) &&
					shop.modules.length > 0 &&
					key < shop.modules.length &&
					key > -1
		}))){
			throw new Meteor.Error("unknown module", "Le module que vous voulez modifier n'existe pas");
		}
		if(!Match.test(serial, Match.Where(function(serial){
			return 	Match.test(serial, String) &&
					Shops.find({
						modules:{
							$elemMatch : {
								serial : serial
							}
						}
					}).count() == 0;
		}))){
			throw new Meteor.Error("unknown shop", "Un module porte déjà ce serial");
		}
		// this.unblock();

		var updator = {};
		updator["modules."+key+".serial"] = serial;
		Shops.update(shopId, {
			$set : updator
		});
		if(this.isSimulation){
			Session.set("successMessage", "Un module pour ce client à reçu un nouveau serial" );
		}
		return "Un module pour ce client à reçu un nouveau serial";
	},

	/*
		data : {
			shopId : Shops._id,
			key : module position in the array owned by the shop
		}
	*/
	shopModuleDestroyer : function(data){
		if (! Meteor.isBoss()) {
			throw new Meteor.Error("not authorized", "Vous devez être un Boss pour supprimer ce module");
		}
		if(!Match.test(data, Object) || _.isEmpty(data)){
			throw new Meteor.Error("wrong formatting object", "Aucune donnée reçue");
		}
		if(!Match.test(data.shopId, String) || _.isEmpty(data.shopId)){
			throw new Meteor.Error("wrong formatting object", "Aucune donnée relative au client reçue");
		}
		if(!Match.test(data.key, Match.Integer)){
			throw new Meteor.Error("wrong formatting object", "Aucune donnée relative au Module reçue");
		}

		var shop = Shops.findOne(data.shopId);
		if(!shop){
			throw new Meteor.Error("unknown shop", "Le client que vous voulez modifier n'existe pas");
		}
		if(!Match.test(data.key, Match.Where(function(key){
			return 	Match.test(key, Match.Integer) &&
					Match.test(shop.modules, [Object]) &&
					shop.modules.length > 0 &&
					key < shop.modules.length &&
					key > -1
		}))){
			throw new Meteor.Error("unknown module", "Le module que vous voulez supprimer n'existe pas");
		}
		// this.unblock();

		
		shop.modules.splice(data.key, 1);
		console.log("PAY ATTENTION TO work.modules.tasks");

		Shops.update(data.shopId, {
			$set : {
				modules : shop.modules
			}
		});

		if(this.isSimulation){
			Session.set("successMessage", "Vous avez supprimé un module à ce client" );
		}
		return "Vous avez supprimé un module à ce client";
	},
	
	/*
		String
	*/
	checkTVA : function(tva){
		if (! Meteor.isWorker()) {
			throw new Meteor.Error("not authorized", "Vous devez être un Travailleur traiter un num de TVA");
		}
		if(!Match.test(tva, String) || _.isEmpty(tva)){
			throw new Meteor.Error("wrong formatting object", "Aucune donnée relative à la TVA reçue");
		}
		// this.unblock();
		if(Meteor.isServer){
			return Meteor.checkTVA(tva);
		}
	}
});


if ( Meteor.isClient ) {
	Ground.methodResume([
		"easyShopCreator",
		"shopCreator",
		"shopDestroyer",
		"shopUpdator",
		"shopAddModule",
		"shopModuleSetSerial",
		"shopModuleDestroyer",
		"checkTVA"

	]);
}
