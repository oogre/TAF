"use strict";
/*global $ : false */
/*global google : false */
/*global Meteor : false */
/*global Tracker : false */
/*global Session : false */
/*global Template : false */
/*global GoogleMaps : false */

var map ;
Template.position.destroyed = function(){
	Session.set(Meteor.MAP_LARGE, false);
};
Template.position.rendered = function(){
	var location = this.data||Meteor.QG.location;
	GoogleMaps.init(
	{	
		"sensor": true,
		//"key": Meteor.google.key,
		"language": "fr"
	},
	function(){
		var mapOptions = {
			center: location,
			zoom: 15
		};
		map = new google.maps.Map($("#map-canvas")[0], mapOptions);

		var markers = {};
		markers.shop = new google.maps.Marker({
			position: location,
			map: map,
			title:""
		});

		var resize = function(isLArge){
			var canvas = $("#map-canvas");
			var width = canvas.parent().width();
			var height = isLArge ? $(window).height()-canvas.offset().top : 150;
			canvas.width(width);
			canvas.height(height);
			google.maps.event.trigger(map, "resize");
			map.setCenter(location);
		};

		Tracker.autorun(function () {
			resize(Session.get(Meteor.MAP_LARGE));
		});

		$(window).resize(function() {
			resize(Session.get(Meteor.MAP_LARGE));
		});
	});
};

Template.position.helpers({
	isLarge : function(){
		return Session.get(Meteor.MAP_LARGE);
	},
	connected : function(){
		return Meteor.status().connected;
	}
});
Template.position.events({
	"click .mapSizer" : function(){
		Session.set(Meteor.MAP_LARGE, !Session.get(Meteor.MAP_LARGE));
		return false;
	}
});