"use strict";
/*global s : false */
/*global Npm : false */
/*global HTTP : false */
/*global Meteor : false */
/*global process : false */

Meteor.checkTVA = function(tva, next){
	var Future = Npm.require("fibers/future");
	var myFuture = new Future();
	tva = tva.replace(/\ |\./g, "");
	tva = {
		countryCode : tva.substring(0, 2).toUpperCase(),
		numero : s.pad(tva.substring(2), 10, "0")
	};
	
	var url = "http://ec.europa.eu/taxation_customs/vies/viesquer.do?ms="+tva.countryCode+"&iso="+tva.countryCode+"&vat="+tva.numero+"&name=&companyType=&street1=&postcode=&city=&requesterMs="+tva.countryCode+"&requesterIso="+tva.countryCode+"&requesterVat="+tva.numero+"&BtnSubmitVat=Verify";
	HTTP.get(url, {
		followRedirects : true
	}, function (error, result) {
		if(error) myFuture.throw(error);
		if(result.statusCode != 200) myFuture.throw(new Meteor.Error("statusCode-"+result.statusCode));
		try{
			var body = result.content;
			var vatResponseFormTable = body.split("<table id=\"vatResponseFormTable\">")[1].split("</table>")[0];
			var name = vatResponseFormTable.split("<td class=\"labelStyle\">Name</td>")[1].split("</td>")[0].split("<td>")[1].trim();
			var address = vatResponseFormTable.split("<td class=\"labelStyle\">Address</td> ")[1].split("</td>")[0].split("<td>")[1].trim();
			var zipcode = address.split("<br />")[1].split(" ")[0].trim();
			var city = address.split("<br />")[1].split(zipcode)[1].trim();
			address = address.split("<br />")[0].trim();
			var street = address.split(/\d{1,4}/g)[0].trim();
			var number = address.split(street)[1].trim();
			myFuture.return({
				TVA : tva.countryCode+tva.numero,
				name : name,
				address : {
					street : street, 
					number : number,
					zipcode : zipcode,
					city : city
				}
			});
		}catch(e){
			myFuture.throw(new Meteor.Error("non_valid_VAT", "Numéros de TVA non valide"));
		}
	});
	return myFuture.wait();
};

Meteor.geocode = function(addres, next){
	if(!Match.test(next, Function)){
		next = function(err, data){
			if(error) return console.log(error);
			console.log(data);
		}
	}
	HTTP.call("GET", "https://maps.googleapis.com/maps/api/geocode/json", {
		params : {
			address : addres,
			key : process.env.KEY_GOOGLE,
		}
	}, function (error, result) {
		if(error) return next(error);
		if(result.statusCode != 200) return next(new Meteor.Error("statusCode-"+result.statusCode));
		if(result.data.status != "OK" ) return next(new Meteor.Error("status : "+results.data.status));
		var location = result.data.results[0].geometry.location;
		return next(null, location);
	});
};

Meteor.getLocationInfo = function(address, next){
	if(!Match.test(next, Function)){
		next = function(err, data){
			if(error) return console.log(error);
			console.log(data);
		}
	}
	Meteor.geocode(address, function(error, location){
		if(error) return next(error, null);
		HTTP.call("GET", "https://maps.googleapis.com/maps/api/distancematrix/json", {
			params : {
				origins : Meteor.QG.location.lat+","+Meteor.QG.location.lng,
				destinations : location.lat+","+location.lng,
				key : process.env.KEY_GOOGLE,
				language  : "fr-FR"
			}
		}, function (error, result) {
			if(error) return next(error, null);
			if(result.statusCode != 200) return next(new Meteor.Error("statusCode-"+result.statusCode), null);
			var duration = result.data.rows[0].elements[0].duration.value;
			next(null, {
				location : location,
				timeDist : duration,
				zone : Meteor.timeDistToZone(duration)
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