"use strict";
/*global _ : false */
/*global $ : false */
/*global Works : false */
/*global Meteor : false */
/*global Session : false */
/*global Matters : false */
/*global Template : false */


Template.matterselector.helpers({
	workModules : function(){
		if(this && this.work && this.shop){
			var work = Works.findOne(this.work._id, {
				fields: {
					moduleMatters: 1
				}
			});
			var shopId = this.shop._id;
			var workId = this.work._id;
			return 	(this
					.shop
					.modules || [])
					.map(function(module, key){
						module.matters =	(_.find(	work.moduleMatters||[], 
												function(moduleMatter){
													return moduleMatter.moduleKey === ""+key;
												})||{}).matters;
						module.key = key;
						module.shopId = shopId;
						module.workId = workId;
						return module;
					});
		}
	}
});
Template.matterselector.destroyed = function(){
	Session.set(Meteor.MODULE_MATTER_SELECTED, false);
};
Template.matterselector.rendered = function(){
	
};

Template.mattermodule.helpers({
	getMatters : function(workId, key, matters){
		return Matters.find({
			$or : [{
				moduletype : this.type	
			},{
				moduletype : ""
			}]
		})
		.fetch()
		.map(function(matter){
			matter.value = (_.find(matters, function(_matter){
								return _matter._id === matter._id;
							})||{}).quantity;
			matter.workId = workId;
			matter.key = key;
			return matter;
		});
	},
	moduleOpened : function(){
		return _.contains((Session.get(Meteor.MODULE_MATTER_SELECTED)||[]), ""+this.key) ? "open" : false;
	},
	disabled : function(){
		return this.abortUpdateTask ? "disabled" : "";
	}
});

Template.mattermodule.events({
	"click .module header" : function(){
		if(_.contains((Session.get(Meteor.MODULE_MATTER_SELECTED)||[]), ""+this.key)){
			Session.set(Meteor.MODULE_MATTER_SELECTED, _.without(Session.get(Meteor.MODULE_MATTER_SELECTED), ""+this.key));
		}
		else{
			Session.set(Meteor.MODULE_MATTER_SELECTED, (Session.get(Meteor.MODULE_MATTER_SELECTED)||[]).concat(""+this.key));
		}
		return false;
	},
	"blur .module input[name='matter']" : function(event){

		var value = $(event.target).val();
		value = parseInt(value);
		if(!_.isNumber(value)){
			return false;
		}
		var matterId_moduleKey_workId = $(event.target).attr("id").split("_");
		var workId = matterId_moduleKey_workId[2];
		var moduleKey = matterId_moduleKey_workId[1];
		var matterId = matterId_moduleKey_workId[0];

		Meteor.call("workModuleUpdator", workId, moduleKey, matterId, value);
		return false;
	}
});