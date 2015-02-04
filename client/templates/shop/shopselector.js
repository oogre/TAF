"use strict";
/*global $ : false */
/*global Shops : false */
/*global Meteor : false */
/*global console : false */
/*global Session : false */
/*global Template : false */

Session.setDefault("newShop", false);


Template.shopselector.rendered = function(){
	// initializes all typeahead instances
	Meteor.typeahead.inject();
	$(".twitter-typeahead").addClass("form-control");
};

Template.shopselector.helpers({
	newShop : function(){
		return Session.get("newShop");
	},
	shops: function(query, callback){
		Session.set("newShop", false);
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

Template.shopselector.events({
	"keyup .typeahead": function(event) {
		console.log(event.keyCode);
		if(event.keyCode === 13 || event.keyCode === 16 || event.keyCode === 9 || (event.keyCode>=37 && event.keyCode<=40)) return ;
		if(event.target.value && $(".tt-suggestions").length === 0){
			Session.set("newShop", true);
		}
		else{
			Session.set("newShop", false);
		}
	},

	"blur .typeahead": function(event) {
		if(Shops.find({name : event.target.value.toLowerCase()}).fetch().length === 0){
			Session.set("newShop", true);
		}
		else{
			Session.set("newShop", false);
		}
	},

	"click .saveShop" : function(event, template){

		var shopName = template.find("#shopName");
		var contact = template.find("#contact");
		var errors = template.find(".has-error");
		var savShop = template.find(".saveShop");
		
		$(errors)
		.removeClass("has-error");

		var validation = function(element){
			if(!element.value){
				$(element)
				.parent()
				.addClass("has-error");
				return true;
			}
			return false;
		};
		if(	validation(shopName) || validation(contact)){
			return false;
		}

		Meteor.call("easyShopCreator", {
			name : shopName.value.toLowerCase(),
			contact : contact.value.toLowerCase(),
		}, function(error){
			if(error){
				console.log(error);
			}
			else{
				$(savShop)
				.removeClass("btn-primary")
				.addClass("btn-success");
			}
		});

		return false;
	}
});