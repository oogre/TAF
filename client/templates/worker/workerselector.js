"use strict";
/*global $ : false */
/*global Workers : false */
/*global Meteor : false */
/*global Template : false */


var initSelector = function(){
	$("#workers")
		.multiselect({
			buttonWidth: "100%", 
			includeSelectAllOption: true,
			allSelectedText: "Tout le monde",
			selectAllText : "Tout le monde",
			nonSelectedText : "Aucun Homme",
			onChange: function(option, checked) {
				if(checked){
					//$(".addWorkers").removeClass("hide");
				}
				else{
					//$(".addWorkers").addClass("hide");
				}
			}
		})
		.multiselect("dataprovider", Workers
									.find()
									.map(function(worker){
										if(worker.profile){
											return {
												label: worker.profile.firstname + " " + worker.profile.lastname, 
												value: worker._id
											};
										}
										else{
											return {
												label: "noName", 
												value: worker._id
											};
										}
									})
		);
};

Template.workerselector.rendered = function  () {
	initSelector();
};

Template.workerselector.helpers({
	setMultiselector : function(){
		initSelector();
	},
});

Template.workerselector.workers = function(template, next){
	var deferred = new $.Deferred();
	validator(template, function(error, values){
		if(error) {
			deferred.reject(error);
			return next(error);
		}
		deferred.resolve(values||null);
		return next(null, values||null);
	});
	return deferred;
};

var validator = function(template, next){
	var workers = template.find("#workers");
	var errors = template.find(".worker .has-error");
	
	$(errors)
	.removeClass("has-error");

	var validation = function(element){
		
		return false;
	};
	if(workers){
		if(	validation(workers)){
			return next(new Meteor.Error("validation-error"));
		}
		return next(null, $(workers).val());
	}
	else{
		return next(null, null);
	}
};