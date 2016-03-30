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
			throw new Meteor.Error("wrong formatting object.name", "Ajouter au moin un nom pour ce client");
		}
		shop.name = shop.name.toLowerCase();
		if(Match.test(shop.name, Match.Where(function(name){
			return 	Shops.findOne({
						name : name
					});
		}))){
			var shop = 	Shops.findOne({
							name : shop.name
						});
			throw new Meteor.Error("non unique shop.name", "Un client porte déjà ce nom <a href='"+Router.path("shop.view", {id : shop._id})+"'>Voir</a>");
		}
		if(!Match.test(shop.contacts, [String])){
			throw new Meteor.Error("wrong formatting object.contacts", "Ajouter au moins un contact");
		}
		this.unblock();
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
		if (! Meteor.isBoss()) {
			throw new Meteor.Error("not authorized", "Vous devez être un Boss pour créer un client");
		}
		if(!Match.test(shop, Object) || _.isEmpty(shop)){
			throw new Meteor.Error("wrong formatting object", "Aucune donnée reçue");
		}
		if(!Match.test(shop.name, String) || _.isEmpty(shop.name)){
			throw new Meteor.Error("wrong formatting object.name", "Ajouter au moin un nom pour ce client");
		}
		if(!Match.test(shop.brand, String) || _.isEmpty(shop.brand)){
			throw new Meteor.Error("wrong formatting object.brand", "Ajouter au moin un nom d'enseigne pour ce client");
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
		this.unblock();
		
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
		this.unblock();
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
		if (! Meteor.isBoss()) {
			throw new Meteor.Error("not authorized", "Vous devez être un Boss pour créer un client");
		}
		if(!Match.test(shop, Object) || _.isEmpty(shop)){
			throw new Meteor.Error("wrong formatting object", "Aucune donnée reçue");
		}
		if(!Match.test(shopId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Shops.findOne(id);
		}))){
			throw new Meteor.Error("unknown shop", "Le client que vous voulez modifier n'existe pas");
		}
		if(!Match.test(shop.name, String) || _.isEmpty(shop.name)){
			throw new Meteor.Error("wrong formatting object.name", "Ajouter au moin un nom pour ce client");
		}
		if(!Match.test(shop.brand, String) || _.isEmpty(shop.brand)){
			throw new Meteor.Error("wrong formatting object.brand", "Ajouter au moin un nom d'enseigne pour ce client");
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

		this.unblock();

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
	shopModuleUpdator : function(shopId, key, module){
		var updator = {};
		_.map(module, function(module, k) {
			updator["modules."+key+"."+k] = module;
		});
		Shops.update(shopId, {
			$set : updator
		});
	},
	shopModuleDestroyer : function(data){
		var shop = Shops.findOne(data.shopId);
		shop.modules.splice(data.key, 1);
		console.log("PAY ATTENTION TO work.modules.tasks && work.modulesMatter.matter");
		Shops.update(data.shopId, {
			$set : {
				modules : shop.modules
			}
		});
	},
	shopModuleTask: function(shopId, moduleId, key, taskId){
		var selector = {
			_id : shopId
		};
		selector["modules."+key+".id"] = moduleId;
		
		var updator = {};
		updator["modules."+key+".tasks"] = taskId;

		Shops.update(selector, {
			$set : updator
		});

		return false;
	},
	checkTVA : function(tva){
		this.unblock();
		if(Meteor.isServer){
			return Meteor.checkTVA(tva);
		}
	}
});
