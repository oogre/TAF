"use strict";
/*global _ : false */
/*global Wikis : false */
/*global moment : false */
/*global Meteor : false */
/*global Session : false */
/*global Template : false */

Template.wikilist.destroyed = function(){
	Session.set(Meteor.WIKI_OPEN_LIST, false);
};

Template.wikilist.helpers({
	wikiListOpen : function(){
		return Session.get(Meteor.WIKI_OPEN_LIST);
	},
	wikiCount : function(){
		return Wikis.find({
			_id : {
				$in : _.without(this.wiki_id, Session.get(Meteor.WIKI_CURRENT_KEY))
			}
		}, {
			sort :{
				createdAt : -1
			}
		})
		.count();
	},
	showList : function(){
		return Session.get(Meteor.WIKI_OPEN_LIST);
	},
	wikis : function(){
		var wikis = Wikis.find({
			_id : {
				$in : _.without(this.wiki_id, Session.get(Meteor.WIKI_CURRENT_KEY))
			}
		}, {
			sort :{
				createdAt : -1
			}
		})
		.fetch();
		Session.set(Meteor.WIKI_LIST, wikis.length);
		return wikis;
	},
	createdAt : function(){
		return moment(this.createdAt).format("dd-DD/MM/YY HH:mm");
	},
	uploads: function () {
		return 	this
				.uploads
				.map(function(upload){
					if(_.isString(upload)) return upload;
					return Meteor.serverIP+"/upload/"+upload.path;
				});
	},
});

Template.wikilist.events({
	"click .wikiList" : function(){
		Session.set(Meteor.WIKI_OPEN_LIST, !Session.get(Meteor.WIKI_OPEN_LIST));
		return false;
	}
});