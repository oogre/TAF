(function(){"use strict";
/*global _ : false */
/*global $ : false */
/*global Shops : false */
/*global Router : false */
/*global Meteor : false */
/*global Modules : false */

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

		console.warn("YO");

		if(!shop.name || !shop.contacts || !shop.contacts.length){
			return new Meteor.Error("name-contact-minimal-data");
		}

		console.log(shop);

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
	shopDestroyer: function (shopId) {
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		return Shops.remove(shopId);
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
	shopAddModule : function(shopId, moduleId){
		Shops.update(shopId, {
			$push : {
				modules : Modules.findOne(moduleId)
			}
		});
		return true;
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

})();
