"use strict";
/*global _ : false */
/*global Shops : false */
/*global Meteor : false */
/*global Session : false */
/*global Template : false */


Template.workmodules.helpers({
	workModules : function(){
		if(this.shop && this.shop.modules){
			var shopId = this.shop._id;
			return 	(this
					.shop
					.modules || [])
					.map(function(module, key){
						module.key = key;
						module.shopId = shopId;
						return module;
					});
		}
	}
});

Template.workmodule.helpers({
	key : function(){
		return this.key;
	},
	taskIds : function(){
		return Session.get(Meteor.TASK_SELECTED)["module_"+this.key];
	},
	moduleSelected : function(){
		return _.contains((Session.get(Meteor.MODULE_SELECTED)||[]), this.key) ? "selected" : false;
	}
});

Template.workmodule.events({
	"click .module header" : function(){
		var tasks;
		if(_.contains((Session.get(Meteor.MODULE_SELECTED)||[]), this.key)){
			Session.set(Meteor.MODULE_SELECTED, _.without(Session.get(Meteor.MODULE_SELECTED), this.key));
			
			tasks = Session.get(Meteor.TASK_SELECTED);
			delete tasks["module_"+this.key];
			Session.set(Meteor.TASK_SELECTED, tasks);
		}else{
			Session.set(Meteor.MODULE_SELECTED, (Session.get(Meteor.MODULE_SELECTED)||[]).concat(this.key));
			
			tasks = Session.get(Meteor.TASK_SELECTED);
			tasks["module_"+this.key] = [];
			Session.set(Meteor.TASK_SELECTED, tasks);
		}
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

Template.workmodule.destroyed = function(){
	Session.set(Meteor.MODULE_OPEN, false);
	Session.set(Meteor.MODULE_SELECTED, false);
	Session.set(Meteor.TASK_SELECTED, {});
};