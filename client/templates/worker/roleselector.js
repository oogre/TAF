 "use strict";
/*global Roles : false */
/*global Meteor : false */
/*global Template : false */

Template.roleselector.helpers({
	roles : function(){
		var self=this;
		if(Meteor.user()){
			return Roles.find({
				level : {
					$lte : Meteor.user().profile.role
				}
			}, {
				sort : {
					level : 1
				}
			})
			.fetch()
			.map(function(role){
				role.selected = (self.currentrole == role.level);
				return role;
			});
		}
	}
});