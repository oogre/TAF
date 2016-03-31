 "use strict";
/*global $ : false */
/*global Meteor : false */
/*global Template : false */

Template.workernew.events({
	"click .createUser" : function(event, template){
		var savUser = template.find(".createUser");
		var errors = template.find(":not(.pwd) .has-error");
		
		var firstname = template.find("#firstname");
		var lastname = template.find("#lastname");
		var email = template.find("#emails");
		var role = $("#role")[0];
		var address_street = template.find("#address_street");
		var address_number = template.find("#address_number");
		var address_zipcode = template.find("#address_zipcode");
		var address_city = template.find("#address_city");
		var address_country = template.find("#address_country");
		var phone = template.find("#phone");

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

		if(	validation(firstname) || validation(lastname) ||validation(address_street) || validation(address_number) || validation(address_zipcode) || validation(address_city) || validation(address_country) || validation(phone)){
			return false;
		}

		Meteor.call("workerCreator", {
			email : email.value.toLowerCase(),
			profile : {
				firstname : firstname.value.toLowerCase(),
				lastname : lastname.value.toLowerCase(),
				role : parseInt(100),
				phone : phone.value.toLowerCase(),
				address : {
					street : address_street.value.toLowerCase(),
					number : address_number.value.toLowerCase(),
					zipcode : address_zipcode.value.toLowerCase(),
					city : address_city.value.toLowerCase(),
					country : address_country.value.toLowerCase()
				}
			}
		}, function(error, data){	
			if(error) return Session.set("errorMessage", error.reason );
			$(savUser)
			.removeClass("btn-primary")
			.addClass("btn-success");
			Router.go("home");
			Session.set("successMessage", data );
		});

		return false;
	}
});