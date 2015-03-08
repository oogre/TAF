"use strict";
/*global _ : false */
/*global $ : false */
/*global Meteor : false */
/*global Tasks : false */
/*global Template : false */

var getTasks = function(selected_ids, forcedId){
	var selector = {};
	if(_.isArray(forcedId)){
		selector._id = {$in : forcedId};
	}
	console.log(selector);
	return 	_
			.chain(Tasks.find(selector).fetch())
			.groupBy(function(task){
				return task.moduletype;
			})
			.map(function(tasks, group){
				return {
					label : group||"Sans catégorie",
					children : 	tasks
								.map(function(task){
									return {
										selected : _.contains(selected_ids, task._id),
										label: task.name, 
										value: task._id
									};
								})
				};
				
			})
			.sortBy(function(task){
				return task.label;
			})
			.value();

};

var initSelector = function(self, tasks){
	$("#tasks")
	.multiselect({
		buttonWidth: "100%", 
		includeSelectAllOption: true,
		selectAllText : "Toutes les tâches",
		buttonText: function() {
			if(self.raw){
				return "Tâche pour ce module";
			}else{
				return "THIS SHOULD BE SHOWN";
			}
		},
		onChange: function(){
			if(_.isArray(self.forced_id)){
			}
			else{
				Meteor.call("shopModuleTask", self.shopId, self.moduleId, self.key, $("#tasks").val());
			}
		}
	})
	.multiselect("dataprovider", tasks);
};

Template.taskselector.helpers({
	tasks : function(){
		return getTasks(this.task_ids, this.forced_id);
	},
	initMultiselector : function(){
		return initSelector(this, getTasks(this.task_ids, this.forced_id));
	}
});

Template.taskselector.rendered = function(){
	return initSelector(this.data, getTasks(this.data.task_ids, this.data.forced_id));
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
	var tasks = template.find("#tasks");
	var errors = template.find(".tasks .has-error");
	
	$(errors)
	.removeClass("has-error");

	var validation = function(element){
		
		return false;
	};
	if(tasks){
		if(	validation(tasks)){
			return next(new Meteor.Error("validation-error"));
		}
		return next(null, $(tasks).val());
	}
	else{
		return next(null, null);
	}
};