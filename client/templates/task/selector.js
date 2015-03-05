"use strict";
/*global $ : false */
/*global Meteor : false */
/*global Tasks : false */
/*global Template : false */

var getTasks = function(){
	return Tasks
			.find()
			.fetch()
			.map(function(task){
				return {
					label: task.name, 
					value: task._id
				};
			});
};

var initSelector = function(tasks){
	$("#tasks")
	.multiselect({
		buttonWidth: "100%", 
		includeSelectAllOption: true,
		allSelectedText: "Toutes les tâches",
		selectAllText : "Toutes les tâches",
		nonSelectedText : "Aucune Tâche",
	})
	.multiselect("dataprovider", tasks);
};

Template.taskselector.helpers({
	tasks : function(){
		return getTasks();
	},
	initMultiselector : function(){
		return initSelector(getTasks());
	}
});

Template.taskselector.rendered = function(){
	return initSelector(getTasks());
};

Template.taskselector.tasks = function(template, next){
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
	var workers = template.find("#tasks");
	var errors = template.find(".tasks .has-error");
	
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