"use strict";
/*global Meteor : false */
/*global Session : false */
/*global Template : false */
/*global Workers : false */
/*global moment : false */
/*global console : false */
/*global $ : false */

Template.workEdit.helpers({
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