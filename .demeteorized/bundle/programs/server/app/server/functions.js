(function(){"use strict";
/*global s : false */
/*global Npm : false */
/*global HTTP : false */
/*global Meteor : false */
/*global process : false */

Meteor.checkTVA = function(tva){
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
			myFuture.throw(new Meteor.Error("non_valid_VAT"));
		}
	});
	return myFuture.wait();
};

Meteor.geocode = function(addres, next){
	var getGeocodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=[ADDRES]&key=[APIKEY]";
	getGeocodeUrl = getGeocodeUrl
					.replace("[ADDRES]", addres)
					.replace("[APIKEY]", process.env.KEY_GOOGLE);
					
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
}).call(this);

//# sourceMappingURL=functions.js.map
