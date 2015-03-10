"use strict";
/*global $ : false */
/*global Shops : false */
/*global Router : false */
/*global Meteor : false */
/*global moment : false */
/*global Session : false */
/*global Workers : false */
/*global console : false */
/*global Template : false */

Template.workEdit.helpers({
	showModule : function(){
		if(this && this.type === "maintenance") return true;
	},
	shop : function(){
		return Shops.findOne(this.shop._id);
	},
	addModule : function(){
		return Session.get(Meteor.ADD_MODULE);
	},
	addWorker : function(){
		return Session.get(Meteor.ADD_WORKER);
	},
	canAddWorker : function(){
		return Workers.find({
			_id : {
				$nin : this.worker_ids||[]
			}
		}).fetch();
	}
});

Template.workEdit.events({
	"click .moduleAdd" : function(){
		if(Session.get(Meteor.ADD_MODULE)){
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
	"click .workClose" : function(event){
		var workId = $(event.target).parents("[data-work-id]").first().attr("data-work-id");
		Meteor.call("workCloser", workId, moment().toISOString(), function(error){
			if(error) return console.log(error);
			Router.go("work.show", {workId : workId});
		});
		return false;
	}
});

Template.workSummary.helpers({
	addWorker : function(){
		return Session.get(Meteor.ADD_WORKER);
	},
	canAddWorker : function(){
		return Workers.find({
			_id : {
				$nin : this.worker_ids||[]
			}
		}).fetch();
	}
});

Template.workSummary.events({
	"click .workerAdd" : function(){
		Session.set(Meteor.ADD_WORKER, !Session.get(Meteor.ADD_WORKER));
		return false;
	}
});
Template["work-viewaction"].events({
	"click .workClose" : function(){
		var workId = $("[data-work-id]").first().attr("data-work-id");
		Meteor.call("workCloser", workId, moment().toISOString(), function(error){
			if(error) return console.log(error);
			Session.set(Meteor.CONTEXT_MENU_KEY, false);
			Router.go("work.show", {workId : workId});
		});
		return false;
	},
	"click .workReopen" : function(){
		var workId = $("[data-work-id]").first().attr("data-work-id");
		Meteor.call("workReopener", workId, function(error){
			if(error) return console.log(error);
			Session.set(Meteor.CONTEXT_MENU_KEY, false);
			Router.go("work.show", {workId : workId});
		});
		return false;
	},
	"click .workDestructor" : function(){
		var workId = $("[data-work-id]").first().attr("data-work-id");
		Meteor.call("workDestructor", workId, function(error){
			if(error) return console.log(error);
			Session.set(Meteor.CONTEXT_MENU_KEY, false);
			Router.go("home");
		});
	}
});