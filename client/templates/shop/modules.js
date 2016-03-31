"use strict";
/*global _ : false */
/*global Meteor : false */
/*global Modules : false */
/*global Session : false */
/*global Template : false */


Template.shopmodules.helpers({
	shopModules : function(){
		if(this.shop && this.shop.modules){
			var shopId = this.shop._id;
			return 	(this
					.shop
					.modules || [])
					.map(function(module, key){
						module.id = module._id;
						delete module._id;
						module.key = key;
						module.shopId = shopId;
						return module;
					});
		}
	}
});

Template.shopmodule.helpers({
	modulOpen : function(){
		return Session.get(Meteor.MODULE_OPEN) === this.key;
	},
	key : function(){
		return this.key;
	},
	taskIds : function(){
		if(this.shop && !this.tasks){
			return this.shop.modules[this.key].tasks;
		}
	},
	showRemove : function(){
		return !_.isArray(this.tasks);
	},
	selector : function(){
		return JSON.stringify({
			shopId : this.shopId,
			moduleId : this.id,
			key : this.key
		});
	}
});

Template.shopmodule.events({
	"click .module header" : function(){
		if(Session.get(Meteor.MODULE_OPEN) === this.key){
			Session.set(Meteor.MODULE_OPEN, false);
		}
		else{
			Session.set(Meteor.MODULE_OPEN, this.key);
		}
		return false;
	},
	"blur #serial" : function(event){
		Meteor.call("shopModuleSetSerial", this.shopId, this.key, event.target.value, function(error, data){
			if(error) return Session.set("errorMessage", error.reason );
			Session.set("successMessage", data );
		});
		Session.set(Meteor.MODULE_OPEN, false);
	}
});

Template.shopmodule.destroyed = function(){
	Session.set(Meteor.MODULE_OPEN, false);
};