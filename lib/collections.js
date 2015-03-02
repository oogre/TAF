/*global Shops : true */
/*global Wikis : true */
/*global Works : true */
/*global Roles : true */
/*jshint strict : false */
/*global Meteor : false */
/*global Workers : true */



Workers = Meteor.users;
Shops = new Meteor.Collection("shops");
Wikis = new Meteor.Collection("wikis");
Works = new Meteor.Collection("works");
Roles = new Meteor.Collection("roles");


Workers.allow({
	insert: function () {
		// can only create workers where you are the author
		return true;
	},
	update: function () {
		// can only delete your own workers
		return true;
	},
	remove : function(){
		return true;	
	}
});