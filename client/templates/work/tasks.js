"use strict";
/*global _ : false */
/*global $ : false */
/*global Works : false */
/*global Shops : false */
/*global Meteor : false */
/*global Session : false */
/*global Template : false */


Template.workmodules.helpers({
	workModules : function(){

		if(this.shop && this.shop.modules){
			var shopId = this.shop._id;
			return (this
					.shop
					.modules || [])
					.map(function(module, key){
						module.key = key;
						module.shopId = shopId;
						module.id = module._id;
						delete module._id;
						return module;
					});
		}else if(this.work && this.work.modules){
			var workId = this.work._id;
			var abortUpdateTask = this.abortUpdateTask;
			return 	(this
					.work
					.modules || [])
					.map(function(module, key){
						module.key = key;
						module.workId = workId;
						module.tasks = module.tasks.map(function(task){
							task.moduleKey = module.key;
							task.workId = workId;
							task.abortUpdateTask = abortUpdateTask;
							return task;
						});
						module.id = module._id;
						delete module._id;
						return module;
					});
		}
	}
});
Template.workmodules.destroyed = function(){
	Session.set(Meteor.TASK_SELECTED, {});
	Session.set(Meteor.MODULE_SELECTED, false);
};
Template.workmodules.rendered = function(){
	var self = this;
	if(self.data.work && self.data.shop){
		var keys = _.pluck(self.data.work.modules, "moduleKey");
		Session.set(Meteor.MODULE_SELECTED, keys);
		
		var tasks = Session.get(Meteor.TASK_SELECTED);
		keys.map(function(key){
			tasks["module_"+key] = 	_
									.pluck(	_
											.find(	self.data.work.modules, 
													function(module){
														return module.moduleKey == key;
													}
											).tasks, 
											"_id"
									);
		});
		Session.set(Meteor.TASK_SELECTED, tasks);
	}
};

Template.workmodule.helpers({
	taskCompleted : function(){
		if(this.workId){
			return _.every(_.pluck(this.tasks, "checked"), _.identity) ? "completed" : "";
		}
	},
	key : function(){
		return ""+this.key;
	},
	taskIds : function(){
		return Session.get(Meteor.TASK_SELECTED)["module_"+this.key];
	},
	moduleSelected : function(){
		return (this.shopId && Session.equals(Meteor.ADD_MODULE, true) && _.contains((Session.get(Meteor.MODULE_SELECTED)||[]), ""+this.key)) ? "selected" : false;
	},
	moduleOpened : function(){
		return (this.workId && Session.equals(Meteor.ADD_MODULE, false) && Session.equals(Meteor.MODULE_SELECTED, ""+this.key)) ? "open" : false;
	},
	disabled : function(){
		return this.abortUpdateTask ? "disabled" : "";
	},
	checked : function(moduleKey, taskId){
		var work = Works.findOne(this.workId);
		if(work && work.modules && work.modules[moduleKey] && work.modules[moduleKey].tasks){
			var task = _.find(work.modules[moduleKey].tasks, function(task){
				return task._id == taskId;
			});
			if(task){
				return _.isString(task.checked) ? task.checked : (task.checked === true ? "checked" : "");
			}
		}
	}
});

Template.workmodule.events({
	"click .module header" : function(){
		var tasks;
		if(Session.equals(Meteor.ADD_MODULE, true)){
			if(_.contains((Session.get(Meteor.MODULE_SELECTED)||[]), ""+this.key)){
				Session.set(Meteor.MODULE_SELECTED, _.without(Session.get(Meteor.MODULE_SELECTED), ""+this.key));
				
				tasks = Session.get(Meteor.TASK_SELECTED);
				delete tasks["module_"+this.key];
				Session.set(Meteor.TASK_SELECTED, tasks);
			}else{
				Session.set(Meteor.MODULE_SELECTED, (Session.get(Meteor.MODULE_SELECTED)||[]).concat(""+this.key));
				
				tasks = Session.get(Meteor.TASK_SELECTED);
				tasks["module_"+this.key] = [];
				Session.set(Meteor.TASK_SELECTED, tasks);
			}
		}else{
			if(Session.equals(Meteor.MODULE_SELECTED, ""+this.key)){
				Session.set(Meteor.MODULE_SELECTED, false);
				tasks = Session.get(Meteor.TASK_SELECTED);
				delete tasks["module_"+this.key];
				Session.set(Meteor.TASK_SELECTED, tasks);
			}else{
				Session.set(Meteor.MODULE_SELECTED, ""+this.key);
				
				tasks = Session.get(Meteor.TASK_SELECTED);
				tasks["module_"+this.key] = [];
				Session.set(Meteor.TASK_SELECTED, tasks);

				var hash = "#"+this.key;
				setTimeout(function(){
					location.hash = hash;
				}, 200);
			}
		}
		
		return false;
	},
	"click .module button.checkbox" : function(event){
		var target = $(event.target);
		var id = target.attr("id") ? target.attr("id") : target.parent().attr("id");
		var moduleKey_taskId = id.split("_");
		var taskId = moduleKey_taskId.pop();
		var moduleKey = moduleKey_taskId.pop();
		Meteor.call("workTaskChecker", this.workId, moduleKey, taskId, false, function(error, data){
			if(error) return Session.set("errorMessage", error.reason );
		});
		return false;
	},
	"blur .module input[name='checkbox']" : function(event){
		var moduleKey_taskId = $(event.target).attr("id").split("_");
		var taskId = moduleKey_taskId.pop();
		var moduleKey = moduleKey_taskId.pop();
		var value = _.isString($(event.target).val()) ? $(event.target).val() : false;
		Meteor.call("workTaskChecker", this.workId, moduleKey, taskId, value, function(error, data){
			if(error) return Session.set("errorMessage", error.reason );
		});
		return false;
	}
});

Template.workmodule.modules = function(){
	var shop = Shops.findOne(Session.get(Meteor.SHOP_ID));
	return 	Template
			.taskselector
			.tasks()
			.map(function(module){
				return _.extend(shop.modules[module.moduleKey], module);
			});
};