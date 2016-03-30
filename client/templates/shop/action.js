"use strict";
/*global $ : false */
/*global Router : false */
/*global Template : false */


Template.shopaction.events({
	"keyup input[name='reasearch']" : function(event){
		var value = $(event.target).val();
		value = value.replace(/\.|\\|\+|\*|\?|\[|\^|\]|\$|\(|\)|\{|\}|\=|\!|\>|\||\:|\-/g, "");
		
		Meteor.clearTimeout(Meteor.timeoutRefshopIndex);
		
		Meteor.timeoutRefshopIndex = Meteor.setTimeout(function(){
			Router.go("shop.index", {}, {
				query: "where="+value
			});
		}, 150);
	},
	"click button[data-action='clear']" : function(event){
		$($(event.target).attr("data-target")).val("");
		Router.go("shop.index");
		return false;
	}
});

Template.shopaction.helpers({
	search : function(){
		return this.where;
	}
});