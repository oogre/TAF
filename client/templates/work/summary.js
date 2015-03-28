"use strict";
/*global Meteor : false */
/*global moment : false */
/*global Session : false */
/*global Template : false */

Template.workSummary.helpers({
	showTasks : function(){
		if(this && this.type === "maintenance" && this.modules) return true;
	},
	showMatters : function(){
		if(this && this.type !== "installation") return true;
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