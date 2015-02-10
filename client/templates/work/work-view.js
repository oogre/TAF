"use strict";
/*global Meteor : false */
/*global Session : false */
/*global Template : false */
/*global Workers : false */


Template["work-view"].helpers({
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

Template["work-view"].events({
	"click .workerAdd" : function(){
		Session.set(Meteor.ADD_WORKER, !Session.get(Meteor.ADD_WORKER));
		return false;
	}
});