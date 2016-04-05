(function(){"use strict";
/*global Meteor : false */
/*global Session : false */
/*global Template : false */

Template.module.helpers({
	modulOpen : function(){
		if(this.module){
			return Session.get(Meteor.MODULE_OPEN) === (this.module._id+"_"+this.key);
		}
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
	}
});

Template.module.events({
	"click .module button.btn-module" : function(){
		if(Session.get(Meteor.MODULE_OPEN) === (this.module._id+"_"+this.key)){
			Session.set(Meteor.MODULE_OPEN, false);
		}
		else{
			Session.set(Meteor.MODULE_OPEN, this.module._id+"_"+this.key);
		}
		return false;
	},
	"click .module button.removeModule" : function(){
		Meteor.call("shopModuleDestroyer", this.shop._id, this.module._id, this.key);
	}
});


Template.module.destroyed = function(){
	Session.set(Meteor.MODULE_OPEN, false);
};
}).call(this);
