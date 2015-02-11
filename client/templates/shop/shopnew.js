"use strict";
/*global $ : false */
/*global _ : false */
/*global Meteor : false */
/*global Template : false */
/*global Session : false */



Template.shopnew.helpers({
	contacts : function(){
		return Session.get(Meteor.CONTACT_LIST);
	}	
});
Template.shopnew.events({
	"blur [name='contact']" : function(){
		var $target = $(event.target);
		var pos = 0;
		_.find($("[name='contact']"), function(contact){
			var res = $target.is(contact);
			if(!res){
				pos++;
			}
			return res;
		});
		var contacts = Session.get(Meteor.CONTACT_LIST);
		contacts[pos] = $target.val();
		Session.set(Meteor.CONTACT_LIST, contacts);
		return false;
	},
	"blur input#tva" : function(event, template){
		var TVA = $(event.target).val();
		Meteor.call("checkTVA", TVA, function(error, data){
			if(error)console.log(error);
			template.find("#tva").value = data.TVA.toLowerCase();
			template.find("#name").value = data.name.toLowerCase();
			template.find("#address_street").value = data.address.street.toLowerCase();
			template.find("#address_number").value = data.address.number.toLowerCase();
			template.find("#address_city").value = data.address.city.toLowerCase();
			template.find("#address_zipcode").value = data.address.zipcode.toLowerCase();
		});
	},
	"click .addContact" : function(){
		Session.set(Meteor.CONTACT_LIST, Session.get(Meteor.CONTACT_LIST).concat([""]));
		return false;
	},
	"click .shopSave" : function(event, template){
		var savShop = template.find(".shopSave");
		var errors = template.find(".has-error");
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

		

		Meteor.call("shopCreator", {
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