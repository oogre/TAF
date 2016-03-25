"use strict";
/*global _ : false */
/*global Meteor : false */
/*global google : false */

Meteor.routing = function(originLocation, destinationLocation, next){
	var origin      = new google.maps.LatLng(originLocation.lat,originLocation.lng);
	var destination = new google.maps.LatLng(destinationLocation.lat,destinationLocation.lng);
	if(origin && destination){
		var request = {
			origin      : origin,
			destination : destination,
			travelMode  : google.maps.DirectionsTravelMode.DRIVING // Type de transport
		};
		var directionsService = new google.maps.DirectionsService(); // Service de calcul d'itinéraire
		directionsService.route(request, function(response, status){ // Envoie de la requête pour calculer le parcours
			if(status == google.maps.DirectionsStatus.OK){
				return next(null, response);
			}else{
				return next(new Meteor.Error(status));
			}
		});
	}else{
		return next(new Meteor.Error("originLocation/destinationLocation failed"));
	}
};

Meteor.getLocation = function(next){
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function showPosition(position) {
			return next(null, {
				lat : position.coords.latitude,
				lng : position.coords.longitude
			});
		});
	}else{
		return next(null, Meteor.QG.location);
	}
};


Meteor.watchLocation = function(next){
	if (navigator.geolocation) {
		return navigator.geolocation.watchPosition(function showPosition(position) {
			next(null, new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
		});
	}
	else{
		next(new Meteor.Error("location failed"));
	}
};

Meteor.b64toBlob = function(b64, onsuccess, onerror) {
	var img = new Image();
	img.onerror = onerror;
	img.onload = function onload() {
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		canvas.toBlob(onsuccess);
	};
	img.src = b64;
};

Meteor.timeDistToZone = function(timeInSeconds){
	var timeDist = 2 * Math.ceil(timeInSeconds / 900) * 900;
	timeDist = moment.duration(timeDist , "seconds");
	var hours = Math.floor(timeDist.asHours());
	var min = (timeDist.minutes() / 60)  * 100;
	return timeInSeconds ? hours+"."+min : "";
};

_.isJson = function(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};