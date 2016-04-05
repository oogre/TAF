(function(){"use strict";
/*global _ : false */
/*global $ : false */
/*global google : false */
/*global Meteor : false */
/*global Tracker : false */
/*global Session : false */
/*global Template : false */
/*global GoogleMaps : false */


var directionsDisplay;
var markers = {};
var center;
var zoom;
var map ;

var initRouter = function(destination){
	Meteor.getLocation(function(error, origin){
		if(error) return console.log(error);
		Meteor.routing(origin, destination, function(error, route){
			if(error) return console.log(error);
			Session.set(Meteor.MAP_LARGE, true);
			directionsDisplay = new google.maps.DirectionsRenderer();
			directionsDisplay.setMap(map);
			directionsDisplay.setDirections(route);
			var distance = route.routes[0].legs[0].distance.text;
			var duration = route.routes[0].legs[0].duration.text;
			Session.set(Meteor.MAP_ROUTING_DURATION, distance+" ("+duration+")");
			markers.myloc = new google.maps.Marker({
				clickable: false,
				icon: new google.maps.MarkerImage("/images/mobileimgs2.png",
													new google.maps.Size(22,22),
													new google.maps.Point(0,18),
													new google.maps.Point(11,11)),
				shadow: null,
				zIndex: 999,
				map: map
			});
			Session.set(Meteor.MAP_ROUTING, false);
			zoom = map.getZoom();
			center = map.getCenter();
		});
	});
};

var startRouting = function(){
	var flagZoom = true;
	return Meteor.watchLocation(function(error, location){
		if(error)return;
		markers.myloc.setPosition(location);
		center = location;
		if(Session.get(Meteor.MAP_FOLLOW_CENTER)){
			if(flagZoom){
				zoom = 18;
				flagZoom = false;
				map.setZoom(zoom);
			}
			map.setCenter(center);
		}
	});
};

Template.position.destroyed = function(){
	if(_.isNumber(Session.get(Meteor.MAP_ROUTING))){
		navigator.geolocation.clearWatch(Session.get(Meteor.MAP_ROUTING));
		Session.set(Meteor.MAP_ROUTING, null);
	}
	Session.set(Meteor.MAP_LARGE, false);
	Session.set(Meteor.MAP_FOLLOW_CENTER, true);
	Session.set(Meteor.MAP_READY, false);
	Session.set(Meteor.MAP_ROUTING_DURATION, false);
};

Template.position.rendered = function(){
	var shop = this.data;
	center = shop.location;
	zoom = 15;
	if(_.isObject(center)){
		GoogleMaps.init(
		{	
			"sensor": true,
			"language": "fr"
		},
		function(){
			var mapOptions = {
				center: center,
				zoom: zoom
			};
			map = new google.maps.Map($("#map-canvas")[0], mapOptions);
			
			google.maps.event.addListener(map,"drag",function() {
				Session.set(Meteor.MAP_FOLLOW_CENTER, false);
			});
			google.maps.event.addListener(map,"idle",function() {
				Session.set(Meteor.MAP_READY, true);
			});
			
			markers.shop = new google.maps.Marker({
				position: center,
				map: map,
				title:""
			});

			var resize = function(isLArge, followCenter){
				var canvas = $("#map-canvas");
				var width = canvas.parent().width();
				var height = isLArge ? $(window).height()-canvas.offset().top : 150;
				canvas.width(width);
				canvas.height(height);
				google.maps.event.trigger(map, "resize");
				if(followCenter){
					if(map.getZoom()!== zoom){
						map.setZoom(zoom);
					}
					map.setCenter(center);
				}
			};

			Tracker.autorun(function () {
				resize(Session.get(Meteor.MAP_LARGE), Session.get(Meteor.MAP_FOLLOW_CENTER));
			});

			$(window).resize(function() {
				resize(Session.get(Meteor.MAP_LARGE), Session.get(Meteor.MAP_FOLLOW_CENTER));
			});
		});
	}
};

Template.position.helpers({
	isLarge : function(){
		return Session.get(Meteor.MAP_LARGE);
	},
	connected : function(){
		return Meteor.status().connected;
	},
	routingReady : function(){
		return Session.get(Meteor.MAP_ROUTING) === false;
	},
	followCenter : function(){
		return Session.get(Meteor.MAP_FOLLOW_CENTER);
	},
	mapReady : function(){
		return Session.get(Meteor.MAP_READY);
	},
	duration : function(){
		return Session.get(Meteor.MAP_ROUTING_DURATION);	
	}
});

Template.position.events({
	"click .mapSizer" : function(){
		Session.set(Meteor.MAP_LARGE, !Session.get(Meteor.MAP_LARGE));
		return false;
	},
	"click .mapRouter" : function(){
		if(_.isNumber(Session.get(Meteor.MAP_ROUTING))){
			navigator.geolocation.clearWatch(Session.get(Meteor.MAP_ROUTING));
			Session.set(Meteor.MAP_ROUTING, false);
		}
		initRouter(this.location);
		return false;
	},
	"click .mapResume" : function(){
		Session.set(Meteor.MAP_FOLLOW_CENTER, true);
		return false;
	},
	"click .mapRouting" : function(){
		if(_.isNumber(Session.get(Meteor.MAP_ROUTING))){
			navigator.geolocation.clearWatch(Session.get(Meteor.MAP_ROUTING));
			Session.set(Meteor.MAP_ROUTING, false);
		}
		Session.set(Meteor.MAP_ROUTING, startRouting());
		return false;
	}
});

}).call(this);
