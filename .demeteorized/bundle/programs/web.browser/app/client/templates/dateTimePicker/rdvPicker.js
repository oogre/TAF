(function(){"use strict";
/*global $ : false */
/*global Meteor : false */
/*global moment : false */
/*global Session : false */
/*global Template : false */


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
		return next(null, moment(rendezvous.value, rendezvous.getAttribute("data-date-format")).hour("03").toISOString());
	}else{
		return next(null, null);
	}
};

Template.rdvPicker.rendered = function(){
	var self = this;
	var date = this.data.rdv || moment(Session.get(Meteor.CALENDAR_CONF).defaultDate).toISOString();

	$("#rendezvous").datetimepicker({
		icons: {
			time: "fa fa-clock-o",
			date: "fa fa-calendar",
			up: "fa fa-arrow-up",
			down: "fa fa-arrow-down"
		},
		language : "fr",
		defaultDate : moment(date)
	});
	if(this.data.rdv){
		$("#rendezvous").on("dp.change",function (event) {
			Meteor.call("workRdvUpadtor", self.data.workId, event.date.toISOString(), function(error, data){
				if(error) return Session.set("errorMessage", error.reason );
				Session.set("successMessage", data );
			});
		});
	}
};

Template.rdvPicker.helpers({
	dateFormat : function(){
		if(this.rdv) return "dd-DD/MM/YY HH:mm";
		else return "dd-DD/MM/YY";	
	}
});
}).call(this);
