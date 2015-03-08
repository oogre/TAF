/*global Shops : true */
/*global Wikis : true */
/*global Works : true */
/*global Roles : true */
/*global Tasks : true */
/*jshint strict : false */
/*global Meteor : false */
/*global Workers : true */
/*global Modules : true */

Shops = new Meteor.Collection("shops");
Wikis = new Meteor.Collection("wikis");
Works = new Meteor.Collection("works");
Roles = new Meteor.Collection("roles");
Tasks = new Meteor.Collection("tasks");
Modules = new Meteor.Collection("modules");
Workers = Meteor.users;

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