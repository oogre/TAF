"use strict";
/*global _ : false */
/*global $ : false */
/*global Shops : false */
/*global Picts : false */
/*global Router : false */
/*global Meteor : false */
/*global moment : false */
/*global Session : false */
/*global Workers : false */
/*global console : false */
/*global Template : false */

Template.workEdit.destroyed = function(){
	Session.set(Meteor.SHOP_ID, false);
	Session.set(Meteor.ADD_MODULE, false);
	Session.set(Meteor.ADD_WORKER, false);
	Session.set(Meteor.ADD_MATTER, false);
};


Template.workEdit.helpers({
	showTasks : function(){
		if(this && this.type === "maintenance" && this.modules) return true;
	},
	showMatters : function(){
		if(this && this.type !== "installation") return true;
	},
	shop : function(){
		if(this && this.shop){
			return Shops.findOne(this.shop._id);
		}
	},
	addModule : function(){
		if(Meteor.user() && Meteor.user().profile.role >= 90){
			return Session.get(Meteor.ADD_MODULE);	
		}
	},
	addWorker : function(){
		return Session.get(Meteor.ADD_WORKER);
	},
	addMatter : function(){
		return Session.get(Meteor.ADD_MATTER);
	},
	canAddWorker : function(){
		return Workers.find(/*{
			_id : {
				$nin : [] //this.worker_ids||
			}
		}*/).fetch();
	},
	pictureSelector : function(){
		return {
			collection : "Works",
			_id : this._id
		};
	}
});

Template.workEdit.events({
	"click .moduleAdd" : function(){
		if(Session.equals(Meteor.ADD_MODULE, true)){
			var modules = Template.workmodule.modules();
			Meteor.call("workModuleTaskUpdator", this._id, modules);
			Session.set(Meteor.SHOP_ID, false);
		}else{
			Session.set(Meteor.SHOP_ID, this.shop._id);
		}
		Session.set(Meteor.ADD_MODULE, !Session.get(Meteor.ADD_MODULE));
		return false;
	},
	"click .workerAdd" : function(){
		Session.set(Meteor.ADD_WORKER, !Session.get(Meteor.ADD_WORKER));
		return false;
	},
	"click .matterAdd" : function(){
		Session.set(Meteor.ADD_MATTER, !Session.get(Meteor.ADD_MATTER));
		return false;
	},
	"click .workClose" : function(event){
		var workId = $(event.target).parents("[data-work-id]").first().attr("data-work-id");
		Meteor.call("workCloser", workId, moment().toISOString(), function(error){
			if(error) return console.log(error);
			Router.go("work.show", {workId : workId});
		});
		return false;
	}
});