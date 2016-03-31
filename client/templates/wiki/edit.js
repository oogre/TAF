"use strict";
/*global $ : false */
/*global Meteor : false */
/*global Template : false */


Template.wikiform.rendered = function(){
	$("textarea").autosize();
};

Template.wikiform.events({
	"blur textarea" : function(event, template){
		var wiki = {
			description : template.find("textarea").value
		};
		if(!wiki.description){
			return;
		}
		Meteor.call("wikiCreator", this.workId, wiki, function(err, data){
			if(err) return Session.set("errorMessage", error.reason);
			Session.set("successMessage", data);
			Meteor.subscribe("works&wikis", Session.get(Meteor.CALENDAR_CONF).defaultDate);
			template.find("textarea").value = "";
		});
	},
});