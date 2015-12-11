(function(){"use strict";
/*global $ : false */
/*global Shops : false */
/*global Meteor : false */
/*global Session : false */
/*global Template : false */


Template.shopselector.destroyed = function(){
	Session.set(Meteor.SHOP_ID, false);
};

Template.shopselector.rendered = function(){
	// initializes all typeahead instances
	Meteor.typeahead.inject();
	$(".twitter-typeahead").addClass("form-control");
	$(".typeahead")
	.css("boxShadow","none")
	.first()
	.css("opacity", "0");
	Session.set(Meteor.NEW_SHOP_KEY, false);
};

Template.shopselector.helpers({
	newShop : function(){
		return Session.get(Meteor.NEW_SHOP_KEY);
	},
	shops: function(query, callback){
		Session.set(Meteor.NEW_SHOP_KEY, false);
		callback(	Shops
					.find({
						$or : [{
							name : {
								$regex : ".*"+query.toLowerCase()+".*"
							}
						},{
							brand : {
								$regex : ".*"+query.toLowerCase()+".*"
							}
						}, {
							$where : function(){
								return (this.brand+" - "+this.name).match(query.toLowerCase());
							}
						}]
					})
					.fetch()
					.map(function(it){
						return {value: (it.brand||"")+" - "+it.name};
					})
		);
	}
});

Template.shopselector.shop = function(template, next){
	var deferred = new $.Deferred();
	validator(template, function(error, values){
		if(error){
			deferred.reject(error);
			return next(error);
		}
		var shop = Shops.findOne({
			$where : function(){
				return (this.brand+" - "+this.name).match(values.name);
			}
		});
		if(shop){
			var result = $.extend({}, values, {_id : shop._id});
			deferred.resolve(result);
			return next(null, result);
		}
		else{
			saveShop(template, function(error, shopId){
				if(error){ 
					deferred.reject(error);
					return next(error);
				}
				var result = $.extend({}, values, {_id : shopId});
				deferred.resolve(result);
				return next(null, result);
			});	
		}
	});
	return deferred;
};

var validator = function(template, next){
	var shopName = template.find("#shopName");
	var contact = template.find("#contact");
	var errors = template.find(".shopselector .has-error");
	
	$(errors)
	.removeClass("has-error");

	var validation = function(element){
		if(!element.value){
			$(element)
			.parents(".form-group")
			.first()
			.addClass("has-error");
			return true;
		}
		return false;
	};
	if(contact){
		if(	validation(shopName) || validation(contact)){
			return next(new Meteor.Error("validation-error"));
		}
		return next(null, {
			name : shopName.value.toLowerCase(),
			contacts : [contact.value.toLowerCase()],
		});
	}
	else{
		if(validation(shopName)){
			return next(new Meteor.Error("validation-error"));
		}
		return next(null, {
			name : shopName.value.toLowerCase()
		});
	}
};

var saveShop = function(template, next){
	validator(template, function(error, values){
		if(error) return next(error);
		Meteor.call("easyShopCreator", values, function(error, shopId){
			if(error){
				return next(error);
			}
			else{
				var savShop = template.find(".saveShop");
				$(savShop)
				.removeClass("btn-primary")
				.addClass("btn-success");
				return next(null, shopId);
			}
		});
		if(Meteor.status().connected === false){
			return next(null, Shops.findOne({name : values.name})._id);
		}
	});
};

Template.shopselector.events({
	"keyup .typeahead": function(event) {
		if(event.keyCode === 13 || event.keyCode === 16 || event.keyCode === 9 || (event.keyCode>=37 && event.keyCode<=40)) return ;
		if(event.target.value && $(".tt-suggestions").length === 0){
			Session.set(Meteor.NEW_SHOP_KEY, true);
		}
		else{
			Session.set(Meteor.NEW_SHOP_KEY, false);
		}
	},

	"blur .typeahead": function(event) {
		var shop = Shops.findOne({
			$where : function(){
				return ((this.brand||"")+" - "+this.name) === event.target.value.toLowerCase();
			}
		});
		if(shop){
			Session.set(Meteor.SHOP_ID, shop._id);
		}else{
			Session.set(Meteor.SHOP_ID, false);
		}
		if(event.target.value && shop){
			Session.set(Meteor.NEW_SHOP_KEY, false);
		}
		else{
			Session.set(Meteor.NEW_SHOP_KEY, true);
		}
	}
});
}).call(this);
