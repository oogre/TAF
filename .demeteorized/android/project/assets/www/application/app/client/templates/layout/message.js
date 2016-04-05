(function(){Template.errorMessage.helpers({
	warning : function(){
		return ! Session.equals(Meteor.ERROR_MESSAGE, false);
	},
	message : function(){
		return Session.get(Meteor.ERROR_MESSAGE);
	}
});
Template.errorMessage.events({
	"click .close" : function(){
		Session.set(Meteor.ERROR_MESSAGE, false);
		return false;
	}
});

Template.successMessage.helpers({
	warning : function(){
		return ! Session.equals(Meteor.SUCCESS_MESSAGE, false);
	},
	message : function(){
		return Session.get(Meteor.SUCCESS_MESSAGE);
	}
});
Template.successMessage.events({
	"click .close" : function(){
		Session.set(Meteor.SUCCESS_MESSAGE, false);
		return false;
	}
});


}).call(this);
