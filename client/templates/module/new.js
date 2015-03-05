"use strict";
/*global _ : false */
/*global $ : false */
/*global Meteor : false */
/*global Modules : false */
/*global Template : false */



Template.modulenew.helpers({
	types : function(){
		return 	_
				.chain(Modules.find().fetch())
				.groupBy(function(module){ 
					return module.type;
				})
				.keys()
				.value();
	}
});

Template.modulenew.rendered = function(){
	// initializes all typeahead instances
	Meteor.typeahead.inject();
	$(".twitter-typeahead").addClass("form-control");
};
