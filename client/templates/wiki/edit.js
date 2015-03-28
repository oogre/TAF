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
		Meteor.call("wikiCreator", this.workId, wiki, function(err){
			if(err) throw new Meteor.Error(err);
			Meteor.subscribe("works&wikis", Session.get(Meteor.CALENDAR_CONF).defaultDate);
			template.find("textarea").value = "";
		});
	},
});