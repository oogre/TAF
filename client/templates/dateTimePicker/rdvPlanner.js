"use strict";
/*global $ : false */
/*global _ : false */
/*global Template : false */
/*global Meteor : false */
/*global moment : false */

Template.rdvPlanner.dates = function(template, next){
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
	var firstdate = template.find("#firstdate");// DATE
	var interval = template.find("#interval"); 	// MONTH
	var duration = template.find("#duration"); 			// YEAR
	var errors = template.find(".rdvPlanner .has-error");
	
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
		if(element.name.match(/date/) && !element.getAttribute("data-date-format")){
			$(element)
			.parents(".form-group")
			.first()
			.addClass("has-error");
			return true;
		}
		return false;
	};
	if(firstdate){
		if(	validation(firstdate) || validation(interval) || validation(duration)){
			return next(new Meteor.Error("validation-error"));
		}

		firstdate = moment(firstdate.value, firstdate.getAttribute("data-date-format"));
		var lastdate = moment(firstdate).add(duration.value, "year");
		var currentDate = _.clone(firstdate);
		var dates = [];

		while(currentDate.isBefore(lastdate)){
			dates.push(currentDate.toISOString());
			currentDate.add(interval.value, "month");
		}

		return next(null, dates);
	}else{
		return next(null, null);
	}
};

Template.rdvPlanner.rendered = function(){
	$("#firstdate").datetimepicker({
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