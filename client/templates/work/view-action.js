"use strict";
/*global $ : false */

/*global Works : false */
/*global Router : false */
/*global Meteor : false */
/*global moment : false */
/*global Session : false */
/*global console : false */
/*global Template : false */


Template["work-viewaction"].events({
	"click .workClose" : function(){
		var workId = $("[data-work-id]").first().attr("data-work-id");
		Meteor.call("workCloser", workId, moment().toISOString(), function(error, data){
			if(error) return Session.set("errorMessage", error.reason );
			Session.set(Meteor.CONTEXT_MENU_KEY, false);
			Router.go("work.show", {workId : workId});
			Session.set("successMessage", data );
		});
		return false;
	},
	"click .workReopen" : function(){
		var workId = $("[data-work-id]").first().attr("data-work-id");
		Meteor.call("workReopener", workId, function(error, data){
			if(error) return Session.set("errorMessage", error.reason );
			Session.set(Meteor.CONTEXT_MENU_KEY, false);
			Router.go("work.show", {workId : workId});
			Session.set("successMessage", data );
		});
		return false;
	},
	
	"click .print" : function(){
		var workId = $("[data-work-id]").first().attr("data-work-id");
		if(this.type == "entretien"){
			Meteor.call("maintenanceToPdf", workId, function(err, file){
				if(err)console.error(err);
				else window.open(file);
			});
		}
		else{
			Meteor.call("workToPdf", workId, function(err, file){
				if(err)console.error(err);
				else window.open(file);
			});
		}
		return false;
	}

});