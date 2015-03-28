"use strict";
/*global moment : false */
/*global Meteor : false */
/*global Session : false */
/*global Template : false */

Template.wikilist.destroyed = function(){
	Session.set(Meteor.WIKI_OPEN_LIST, false);
};

Template.wikilist.helpers({
	wikis : function(){
		var removable = this.view !== true;
		return 	(this.wikis||[])
				.map(function(wiki){
					wiki.removable = removable;
					return wiki;
				});
	},
	createdAt : function(){
		return moment(this.createdAt).format("dd-DD/MM/YY HH:mm");
	}
});