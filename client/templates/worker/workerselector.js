"use strict";
/*global $ : false */
/*global Workers : false */
/*global Meteor : false */
/*global Template : false */

var getWorkers = function(notPickable){
	notPickable = notPickable||[];
	var workers = 	Workers
					.find({
						_id : {
							$nin : notPickable
						}
					})
					.fetch()
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
					});
	return workers.length ? workers : false;
};
var initSelector = function(workers, autoAdd){
	var workId = $("#workers").parents("[data-work-id]").first().attr("data-work-id");
	$("#workers")
	.multiselect({
		buttonWidth: "100%", 
		includeSelectAllOption: true,
		allSelectedText: "Tout le monde",
		selectAllText : "Tout le monde",
		nonSelectedText : "Aucun Homme",
		onChange: function(option, checked) {
			if(checked){
				if(autoAdd){
					Meteor.call("workAddWorker", workId, $("#workers").val());
				}
			}
		}
	})
	.multiselect("dataprovider", workers);
};

Template.workerselector.helpers({
	workers : function(){
		return getWorkers(this.notPickable);
	},
	initMultiselector : function(){
		return initSelector(getWorkers(this.notPickable), this.autoAdd);
	}
});

Template.workerselector.rendered = function(){
	return initSelector(getWorkers(this.data.notPickable), this.data.autoAdd);
};

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