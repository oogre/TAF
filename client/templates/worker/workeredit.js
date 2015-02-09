"use strict";
/*global $ : false */
/*global Meteor : false */
/*global Session : false */
/*global Accounts : false */
/*global Template : false */



Template.workeredit.rendered = function(){

};

Template.workeredit.helpers({
	currentUser : function(){
		Session.set(Meteor.CHANGE_PWD_KEY, false);
		if(Meteor.user())
			return Meteor.user();
		else
			return {};
	},
	changepwd : function(){
		return Session.get(Meteor.CHANGE_PWD_KEY);
	}
});

Template.workeredit.events({
	"click .updateUser" : function(event, template){
		var savUser = template.find(".updateUser");
		var errors = template.find(":not(.pwd) .has-error");
		var firstname = template.find("#firstname");
		var lastname = template.find("#lastname");
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

		Meteor.call("workerUpdator", Meteor.user()._id, {
			firstname : firstname.value.toLowerCase(),
			lastname : lastname.value.toLowerCase(),
			address : {
				street : address_street.value.toLowerCase(),
				number : address_number.value.toLowerCase(),
				zipcode : address_zipcode.value.toLowerCase(),
				city : address_city.value.toLowerCase(),
				country : address_country.value.toLowerCase()
			},
			phone : phone.value.toLowerCase()
		}, function(error){
			if(error){
				console.log(error);
			}
			else{
				$(savUser)
				.removeClass("btn-primary")
				.addClass("btn-success");
			}
		});

		return false;
	},
	"click .changepwd": function () {
		Session.set(Meteor.CHANGE_PWD_KEY, !Session.get(Meteor.CHANGE_PWD_KEY));
		return false;
	},

	"click .savepwd": function (event, template) {
		var oldPwd = template.find("#old_pwd");
		var newPwd = template.find("#new_pwd");
		var rePwd = template.find("#re_pwd");
		var savPwd = template.find(".savepwd");
		var errors = template.find(".pwd .has-error");
		
		$(errors)
		.removeClass("has-error");
		
		if(!oldPwd.value){
			$(oldPwd)
			.parent()
			.addClass("has-error");
			return false;
		}
		if(!newPwd.value){
			$(newPwd)
			.parent()
			.addClass("has-error");
			return false;
		}
		if(rePwd.value !== newPwd.value){
			$(rePwd)
			.parent()
			.addClass("has-error");
			return false;
		}
		
		Accounts.changePassword(oldPwd.value, newPwd.value, function(error) {
			if(error){
				$(oldPwd)
				.parent()
				.addClass("has-error");
			}
			else{
				$(savPwd)
				.removeClass("btn-primary")
				.addClass("btn-success");
				setTimeout(function(){
					Session.set(Meteor.CHANGE_PWD_KEY, false);
				}, 1000);
			}
		});
		return false;
	},

	
});
