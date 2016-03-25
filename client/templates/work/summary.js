"use strict";
/*global Meteor : false */
/*global moment : false */
/*global Session : false */
/*global Template : false */

Template.workSummary.destroyed = function(){
	Session.set(Meteor.SIGNATURE_NAMED, 0);
	Session.set(Meteor.SIGNATURE_OPEN, false);
};

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
	},
	popupedSig : function(name){
		return Session.equals(Meteor.SIGNATURE_OPEN, name);
	},
	saved : function(name){
		if(this && this.signatures && this.signatures[name.toLowerCase()]){
			var image = this.signatures[name.toLowerCase()];
			if(_.isString(image)) return image;
			if(image.path) return Meteor.pictureServer+"/"+image.path;
		}
		return false;
	},
	disable : function(name){
		if(name == "Client"){
			return Session.get(Meteor.SIGNATURE_NAMED) & 1 ? "" : "disabled";
		}else{
			return Session.get(Meteor.SIGNATURE_NAMED) & 2 ? "" : "disabled";
		}

	}
});

Template.workSummary.events({
	"click .workerAdd" : function(){
		Session.set(Meteor.ADD_WORKER, !Session.get(Meteor.ADD_WORKER));
		return false;
	},
	"click button.sign" : function(event){
		Session.set(Meteor.SIGNATURE_OPEN, $(event.target).hasClass("Client") ? "Client" : "ADF");
		return false;
	},
	"keyup #client_name" : function(event){
		var v = Session.get(Meteor.SIGNATURE_NAMED);
		if($(event.target).val().trim()){
			v |= 1;
		}else{
			v &= 2;
		}
		Session.set(Meteor.SIGNATURE_NAMED, v);
	},
	"keyup #adf_name" : function(event){
		var v = Session.get(Meteor.SIGNATURE_NAMED);
		if($(event.target).val().trim()){
			v |= 2;
		}else{
			v &= 1;
		}
		Session.set(Meteor.SIGNATURE_NAMED, v);
	}
});