"use strict";
/*global $ : false */
/*global Meteor : false */
/*global Template : false */

Template.moduleselector.events({
	"change select#modules" : function(event){
		var select = $(event.target);
		if(select.attr("data-shopId") && select.val()){
			Meteor.call("shopAddModule", select.attr("data-shopId"), select.val(), function(error, data){
				if(error) return Session.set("errorMessage", error.reason);
				return Session.set("successMessage", data);
			});
			select.find("option:first-child")[0].selected = true;
		}
		return false;
	}
});