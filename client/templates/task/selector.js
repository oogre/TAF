"use strict";
/*global _ : false */
/*global $ : false */
/*global Tasks : false */
/*global Meteor : false */
/*global Session : false */
/*global Template : false */
/*global parseInt : false */

var getTasks = function(selected_ids){
	return 	_
			.chain(Tasks.find({}).fetch())
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

Template.taskselector.rendered = function(){
	var data = this.data;
	$("[multiple][data-key='"+data.key+"']")
	.multiselect({
		buttonWidth: "100%", 
		includeSelectAllOption: true,
		selectAllText : "Toutes les tâches",
		buttonText: function() {
			return "Tâche pour ce module";
		},
		onChange: function(){
			var tasks = Session.get(Meteor.TASK_SELECTED);
			tasks["module_"+data.key] = this.$select.val()||[];
			Session.set(Meteor.TASK_SELECTED, tasks);
		}
	})
	.multiselect("dataprovider", getTasks(data.taskIds));
};

Template.taskselector.tasks = function(){
	return	_
			.chain(Session.get(Meteor.TASK_SELECTED))
			.map(function(taskIds, key){
				return {
					moduleKey : key.split("_").pop(),
					tasks :	Tasks
							.find({
								_id : {
									$in : taskIds
								}
							})
							.fetch()

				};
			})
			.value();
};