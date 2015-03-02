"use strict";
/*global $ : false */
/*global _ : false */
/*global Meteor : false */
/*global Template : false */
/*global Session : false */
/*global Router : false */






Template.shopnew.events({
	"click .shopUpdate" : function(){
		var savShop = template.find(".shopUpdate");
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

		var validation = function(element){
			if(!element.value){
				$(element)
				.parent()
				.addClass("has-error");
				return true;
			}
			return false;
		};

		if( validation(tva) || validation(brand) || validation(name) ||validation(address_street) || validation(address_number) || validation(address_zipcode) || validation(address_city) ){
			return false;
		}

		Meteor.call("shopUpdator", _id.value, {
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
		}, ".shopUpdate", function(error){
			if(error){
				console.log(error);
			}
			else{
				$(savShop)
				.removeClass("btn-primary")
				.addClass("btn-success");
				Router.go("shop.index");
			}
		});
		return false;

	}
});