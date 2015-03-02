"use strict";
/*global _ : false */
/*global Wikis : false */
/*global moment : false */
/*global Meteor : false */
/*global Session : false */
/*global Template : false */

Template.wikilist.helpers({
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
					return "/upload/"+upload.path;
				});
	},
});