(function(){"use strict";
/*global UI : false */
/*global Meteor : false */

Meteor.isAdmin = function(){
	return Meteor.user() && Meteor.user().profile && Meteor.user().profile.role >= 100;
};
Meteor.isBoss = function(){
	return Meteor.user() && Meteor.user().profile && Meteor.user().profile.role >= 90;
};
Meteor.isChief = function(){
	return Meteor.user() && Meteor.user().profile && Meteor.user().profile.role >= 80;
};
Meteor.isWorker = function(){
	return Meteor.user() && Meteor.user().profile && Meteor.user().profile.role >= 70;
};
Meteor.isVisitor = function(){
	return Meteor.user() && Meteor.user().profile && Meteor.user().profile.role >= 60;	
};

UI.registerHelper("isConnected", function(){
	return Meteor.status().connected;
});
UI.registerHelper("isAdmin", function() {
	return Meteor.isAdmin();
});
UI.registerHelper("isBoss", function() {
	return Meteor.isBoss();
});
UI.registerHelper("isChief", function() {
	return Meteor.isChief();
});
UI.registerHelper("isWorker", function() {
	return Meteor.isWorker();
});
UI.registerHelper("isVisitor", function() {
	return Meteor.isVisitor();
});
UI.registerHelper("isMobile", function() {
	return Meteor.isCordova;
});
}).call(this);

//# sourceMappingURL=rights.js.map
