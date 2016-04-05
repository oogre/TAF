(function(){"use strict";
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

Meteor.geocode = function(addres, next){
	var getGeocodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=[ADDRES]";
	getGeocodeUrl = getGeocodeUrl
					.replace("[ADDRES]", addres);
					
	HTTP.get(getGeocodeUrl, {
		followRedirects : true
	}, function (error, result) {
		if(error) return next(error);
		if(result.statusCode != 200) return next(new Meteor.Error("statusCode-"+result.statusCode));
		try{
			var body = result.content;
			var location = JSON.parse(body).results[0].geometry.location;
			return next(null, location);
		}catch(e){
			return next(new Meteor.Error("geocode_parsing_error"));
		}
	});
};

Meteor.getLocationInfo = function(address, next){
	if(!Match.test(next, Function)){
		next = function(err, data){
			if(error) return console.log(error);
			console.log(data);
		}
	}
	if(typeof(google) == "undefined"){
		GoogleMaps.init(
		{
			"sensor": true,
			"language": "fr"
		});
	}
	Meteor.geocode(address, function(error, location){
		if(error) return next(error, null);
		Meteor.getLocation(function(error, origin){
			if(error) return next(error, null);
			Meteor.routing(origin, location, function(error, route){
				if(error) return next(error, null);
				var duration = route.routes[0].legs[0].duration.value;
				next(null, {
					location : location,
					timeDist : duration,
					zone : Meteor.timeDistToZone(duration)
				});		
			});
		});
	});
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
}).call(this);
