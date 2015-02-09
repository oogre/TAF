"use strict";
/*global $ : false */
/*global Template : false */
/*global Meteor : false */
/*global moment : false */

Template.rdvPicker.date = function(template, next){
	var deferred = new $.Deferred();
	validator(template, function(error, values){
		if(error) {
			deferred.reject(error);
			return next(error);
		}
		deferred.resolve(values);
		return next(null, values);
	});
	return deferred;
};

var validator = function(template, next){
	var rendezvous = template.find("#rendezvous");
	var errors = template.find(".rdvPicker .has-error");
	
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
	if(rendezvous){
		if(	validation(rendezvous)){
			return next(new Meteor.Error("validation-error"));
		}
		return next(null, moment(rendezvous.value, rendezvous.getAttribute("data-date-format")).toISOString());
	}else{
		return next(null, null);
	}
};

Template.rdvPicker.rendered = function(){
	$("#rendezvous").datetimepicker({
		icons: {
			time: "fa fa-clock-o",
			date: "fa fa-calendar",
			up: "fa fa-arrow-up",
			down: "fa fa-arrow-down"
		},
		language : "fr",
		defaultDate : moment().add(1, "days").hour("08").minute("00")
	});
};