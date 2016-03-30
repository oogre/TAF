"use strict";
/*global $ : false */
/*global Meteor : false */
/*global Template : false */

Template.moduleindex.events({
	"click button[data-shopId]" : function(event){
		var button = $(event.target);
		var shopId = button.attr("data-shopId");
		var moduleId = this._id;

		Meteor.call("shopAddModule", shopId, moduleId, "button[data-shopId][data-moduleId='"+moduleId+"']", function(error, data){
			if(error) return Session.set("errorMessage", error.reason);
			button
			.removeClass("btn-default")
			.addClass("btn-success");
			setTimeout(function(){
				button
				.addClass("btn-default")
				.removeClass("btn-success");
			}, 1000);
			return Session.set("successMessage", data);
		});
		return false;
	}
});