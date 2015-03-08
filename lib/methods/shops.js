"use strict";
/*global _ : false */
/*global $ : false */
/*global Shops : false */
/*global Router : false */
/*global Meteor : false */


Meteor.methods({
	easyShopCreator : function(shop){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		if(!shop.name || !shop.contacts || !shop.contacts.length){
			return new Meteor.Error("name-contact-minimal-data");
		}	
		this.unblock();
		return Shops.insert(shop);
	},
	shopCreator : function(shop, button){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		if(!shop.name || !shop.contacts || !shop.contacts.length){
			return new Meteor.Error("name-contact-minimal-data");
		}
		this.unblock();
		if(!Shops.findOne({name : shop.name})){
			var shopId = Shops.insert(shop);

			if(Meteor.isServer && shop.address.street && shop.address.number && shop.address.city && shop.address.zipcode){
				Meteor.geocode(shop.address.street+" "+shop.address.number+" "+shop.address.city+" "+shop.address.zipcode, function(error, location){
					if(error)return ;
					shop.location = location;
					Shops.update(shopId, shop);	
				});
			}
			
			if(this.isSimulation){
				$(button)
				.removeClass("btn-primary")
				.addClass("btn-success");
				Router.go("shop.index");
			}
			return shopId;
		}
	},
	shopUpdator : function(shopId, shop, button){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		if(!shop.name || !shop.contacts || !shop.contacts.length){
			return new Meteor.Error("name-contact-minimal-data");
		}

		this.unblock();
		if(!Shops.findOne({_id : {$ne : shopId},name : shop.name})){

			Shops.update(shopId, shop);

			if(Meteor.isServer && shop.address.street && shop.address.number && shop.address.city && shop.address.zipcode){
				Meteor.geocode(shop.address.street+" "+shop.address.number+" "+shop.address.city+" "+shop.address.zipcode, function(error, location){
					if(error)return;
					shop.location = location;
					Shops.update(shopId, shop);	
				});
			}

			if(this.isSimulation){
				$(button)
				.removeClass("btn-primary")
				.addClass("btn-success");
				Router.go("shop.index");
			}
			return true;
		}
	},
	shopAddModule : function(shopId, moduleId, button){
		Shops.update(shopId, {
			$push : {
				modules : {
					id : moduleId
				}
			}
		});
		if(this.isSimulation){
			$(button)
			.removeClass("btn-default")
			.addClass("btn-success");
			setTimeout(function(){
				$(button)
				.addClass("btn-default")
				.removeClass("btn-success");
			}, 1000);
		}
		return true;
	},
	shopModuleDestroyer : function(shopId, moduleId, key){
		var selector = {
			_id : shopId
		};
		selector["modules."+key+".id"] = moduleId;
		
		var shop = Shops.findOne(selector);
		shop.modules.splice(key, 1);

		Shops.update(selector, {
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
