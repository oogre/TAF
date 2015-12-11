(function(){/*global Shops : true */
/*global Wikis : true */
/*global Works : true */
/*global Roles : true */
/*global Picts : true */
/*global Tasks : true */
/*global Units : true */
/*jshint strict : false */
/*global Meteor : false */
/*global Matters : true */
/*global Workers : true */
/*global Modules : true */

Shops = new Meteor.Collection("shops");
Shops = new Ground.Collection(Shops);

Wikis = new Meteor.Collection("wikis");
Wikis = new Ground.Collection(Wikis);

Picts = new Meteor.Collection("picts");
Picts = new Ground.Collection(Picts);

Works = new Meteor.Collection("works");
Works = new Ground.Collection(Works);

Roles = new Meteor.Collection("roles");
Roles = new Ground.Collection(Roles);

Tasks = new Meteor.Collection("tasks");
Tasks = new Ground.Collection(Tasks);

Units = new Meteor.Collection("units");
Units = new Ground.Collection(Units);

Matters = new Meteor.Collection("matters");
Matters = new Ground.Collection(Matters);

Modules = new Meteor.Collection("modules");
Modules = new Ground.Collection(Modules);

Workers = Meteor.users;
Workers = new Ground.Collection(Workers);

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
}).call(this);
