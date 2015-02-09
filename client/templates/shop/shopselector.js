"use strict";
/*global $ : false */
/*global Shops : false */
/*global Meteor : false */
/*global Session : false */
/*global Template : false */


Template.shopselector.rendered = function(){
	// initializes all typeahead instances
	Meteor.typeahead.inject();
	$(".twitter-typeahead").addClass("form-control");
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
						name : {
							$regex : ".*"+query.toLowerCase()+".*"
						}
					})
					.fetch()
					.map(function(it){
						return {value: it.name};
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
		var shop = Shops.findOne(values);
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
			contact : contact.value.toLowerCase(),
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
		if(event.target.value && Shops.find({name : event.target.value.toLowerCase()}).fetch().length === 0){
			Session.set(Meteor.NEW_SHOP_KEY, true);
		}
		else{
			Session.set(Meteor.NEW_SHOP_KEY, false);
		}
	}
});