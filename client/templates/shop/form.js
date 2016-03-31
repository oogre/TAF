"use strict";
/*global $ : false */
/*global _ : false */
/*global Meteor : false */
/*global Template : false */
/*global Session : false */
/*global Router : false */


Template.shopform.destroyed = function(){
	Session.set(Meteor.CONTACT_LIST , [""]);
};
Template.shopform.helpers({
	contacts : function(){
		return ((this.shop && this.shop.contacts)||[]).concat(Session.get(Meteor.CONTACT_LIST));
	}	
});

Template.shopform.events({
	"click .addContact" : function(){
		Session.set(Meteor.CONTACT_LIST, Session.get(Meteor.CONTACT_LIST).concat([""]));
		return false;
	},
	"blur input#tva" : function(event, template){
		var TVA = $(event.target).val();
		if(TVA){
			Meteor.call("checkTVA", TVA, function(error, data){
				if(error) return Session.set("errorMessage", error.reason);
				Session.set("errorMessage", false);
				Session.set("successMessage", "Numéros de TVA identifié, formulaire auto-complété");
				template.find("#tva").value = data.TVA.toLowerCase();
				template.find("#name").value = data.name.toLowerCase();
				template.find("#address_street").value = data.address.street.toLowerCase();
				template.find("#address_number").value = data.address.number.toLowerCase();
				template.find("#address_city").value = data.address.city.toLowerCase();
				template.find("#address_zipcode").value = data.address.zipcode.toLowerCase();
			});
		}
	},
	"click button[type='submit']" : function(event, template){
		
		var button = template.find("button[type='submit']");
		var errors = template.find(".has-error");
		var _id = template.find("#_id");
		var tva = template.find("#tva");
		var brand = template.find("#brand");
		var name = template.find("#name");
		var address_street = template.find("#address_street");
		var address_number = template.find("#address_number");
		var address_zipcode = template.find("#address_zipcode");
		var address_city = template.find("#address_city");
		var contacts = template.findAll("[name='contact']");
		
		$(errors)
		.removeClass("has-error");

		var data = {
			tva : tva.value.toLowerCase(),
			brand : brand.value.toLowerCase(),
			name : name.value.toLowerCase(),
			address : {
				street : address_street.value.toLowerCase(),
				number : address_number.value.toLowerCase(),
				zipcode : address_zipcode.value.toLowerCase(),
				city : address_city.value.toLowerCase()
			},
			contacts : 	_
						.without(	contacts
									.map(function(contact){
										return contact.value.toLowerCase();
									}),
									"", 
									null, 
									undefined
						)
		};

		if(_id.value){
			Meteor.call("shopUpdator", _id.value, data, "button[type='submit']", function(error, data){
				if(error){
					Session.set("errorMessage", error.reason);
					$(button)
					.removeClass("btn-primary")
					.addClass("btn-danger");
					return;
				}
				$(button)
				.removeClass("btn-primary")
				.removeClass("btn-danger")
				.addClass("btn-success");
				Router.go("shop.index");
				Session.set("successMessage", "Le client à été modifier : <a class='btn btn-lg btn-link' href='"+Router.path("shop.view", {id : data})+"'>Voir</a>" );
			});	
		}else{
			Meteor.call("shopCreator", data, "button[type='submit']", function(error, data){
				if(error){
					Session.set("errorMessage", error.reason);
					$(button)
					.removeClass("btn-primary")
					.addClass("btn-danger");
					return;
				}
				$(button)
				.removeClass("btn-primary")
				.removeClass("btn-danger")
				.addClass("btn-success");
				Router.go("shop.index");
				Session.set("successMessage", "Le client à été ajouter : <a class='btn btn-lg btn-link' href='"+Router.path("shop.view", {id : data})+"'>Voir</a>" );
			});	
		}
		return false;
	}
});