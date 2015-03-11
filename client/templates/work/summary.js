"use strict";
/*global Meteor : false */
/*global moment : false */
/*global Session : false */
/*global Workers : false */
/*global Template : false */

Template.workSummary.helpers({
	showModule : function(){
		if(this && this.type === "maintenance") return true;
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
	},
	rdv : function(){
		return moment(this.rdv).format("dd-DD/MM/YY");
	},
	end : function(){
		return moment(this.end).format("dd-DD/MM/YY");
	}
});

Template.workSummary.events({
	"click .workerAdd" : function(){
		Session.set(Meteor.ADD_WORKER, !Session.get(Meteor.ADD_WORKER));
		return false;
	}
});