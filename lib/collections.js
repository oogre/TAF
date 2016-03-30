/*global Shops : true */
/*global Wikis : true */
/*global Works : true */
/*global Roles : true */
/*global Picts : true */
/*global Tasks : true */
/*global Units : true */
/*global Moves : true */
/*jshint strict : false */
/*global Meteor : false */
/*global Matters : true */
/*global Workers : true */
/*global Modules : true */
/*global Origins : true */


var isAdmin = function(userId){
	return 	Meteor.isAdmin() &&
			Workers.findOne({
				_id : userId,
				"profile.role" : 100
			}) ;
}

Shops = new Meteor.Collection("shops");
Shops = new Ground.Collection(Shops);
Shops.allow({
	insert: function (userId, doc) {
		return 	isAdmin(userId);
	},
	update : function(userId, doc){
		return 	isAdmin(userId);
	},
	remove : function(userId){
		return 	isAdmin(userId);
	}
});


Wikis = new Meteor.Collection("wikis");
Wikis = new Ground.Collection(Wikis);
Wikis.allow({
	insert: function (userId, doc) {
		return 	isAdmin(userId);
	},
	update : function(userId, doc){
		return 	isAdmin(userId);
	},
	remove : function(userId){
		return 	isAdmin(userId);
	}
});


Picts = new Meteor.Collection("picts");
Picts = new Ground.Collection(Picts);
Picts.allow({
	insert: function (userId, doc) {
		return 	isAdmin(userId);
	},
	update : function(userId, doc){
		return 	isAdmin(userId);
	},
	remove : function(userId){
		return 	isAdmin(userId);
	}
});

Works = new Meteor.Collection("works");
Works = new Ground.Collection(Works);
Works.allow({
	insert: function (userId, doc) {
		return 	isAdmin(userId);
	},
	update : function(userId, doc){
		return 	isAdmin(userId);
	},
	remove : function(userId){
		return 	isAdmin(userId);
	}
});

Roles = new Meteor.Collection("roles");
Roles = new Ground.Collection(Roles);
Roles.allow({
	insert: function (userId, doc) {
		return 	isAdmin(userId);
	},
	update : function(userId, doc){
		return 	isAdmin(userId);
	},
	remove : function(userId){
		return 	isAdmin(userId);
	}
});

Tasks = new Meteor.Collection("tasks");
Tasks = new Ground.Collection(Tasks);
Tasks.allow({
	insert: function (userId, doc) {
		return 	isAdmin(userId);
	},
	update : function(userId, doc){
		return 	isAdmin(userId);
	},
	remove : function(userId){
		return 	isAdmin(userId);
	}
});

Units = new Meteor.Collection("units");
Units = new Ground.Collection(Units);
Units.allow({
	insert: function (userId, doc) {
		return 	isAdmin(userId);
	},
	update : function(userId, doc){
		return 	isAdmin(userId);
	},
	remove : function(userId){
		return 	isAdmin(userId);
	}
});

Matters = new Meteor.Collection("matters");
Matters = new Ground.Collection(Matters);
Matters.allow({
	insert: function (userId, doc) {
		return 	isAdmin(userId);
	},
	update : function(userId, doc){
		return 	isAdmin(userId);
	},
	remove : function(userId){
		return 	isAdmin(userId);
	}
});

Origins = new Meteor.Collection("origins");
Origins = new Ground.Collection(Origins);
Origins.allow({
	insert: function (userId, doc) {
		return 	isAdmin(userId);
	},
	update : function(userId, doc){
		return 	isAdmin(userId);
	},
	remove : function(userId){
		return 	isAdmin(userId);
	}
});

Moves = new Meteor.Collection("moves");
Moves = new Ground.Collection(Moves);
Moves.allow({
	insert: function (userId, doc) {
		return 	isAdmin(userId);
	},
	update : function(userId, doc){
		return 	isAdmin(userId);
	},
	remove : function(userId){
		return 	isAdmin(userId);
	}
});

Modules = new Meteor.Collection("modules");
Modules = new Ground.Collection(Modules);
Modules.allow({
	insert: function (userId, doc) {
		return 	isAdmin(userId);
	},
	update : function(userId, doc){
		return 	isAdmin(userId);
	},
	remove : function(userId){
		return 	isAdmin(userId);
	}
});

Workers = Meteor.users;
Workers = new Ground.Collection(Workers);
Workers.allow({
	insert: function (userId, doc) {
		return 	isAdmin(userId);
	},
	update : function(userId, doc){
		return 	isAdmin(userId);
	},
	remove : function(userId){
		return 	isAdmin(userId);
	}
});