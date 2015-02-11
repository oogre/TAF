"use strict";
/*global _ : false */
/*global s : false */
/*global Shops : false */
/*global Meteor : false */
/*global Workers : false */
/*global Wikis : false */
/*global Works : false */
/*global console : false */
/*global HTTP : false */
/*global Npm : false */


Meteor.methods({
	workerUpdator: function (workerid, worker) {
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		return Workers.update(workerid, {$set : {profile : worker}});
	},
	easyShopCreator : function(shop){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		if(!shop.name || !shop.contacts || !shop.contacts.length){
			return new Meteor.Error("name-contact-minimal-data");
		}	
		return Shops.insert(shop);
	},
	shopCreator : function(shop){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		if(!shop.name || !shop.contacts || !shop.contacts.length){
			return new Meteor.Error("name-contact-minimal-data");
		}
		if(!Shops.findOne({name : shop.name})){
			return Shops.insert(shop);	
		}
	},
	wikiCreator : function(wiki){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		return Wikis.insert(wiki);
	},
	wikiUpdator: function (wikiid, wiki) {
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		if(!wiki.title || !wiki.description){
			return new Meteor.Error("title-description-minimal-data");
		}
		Wikis.update(wikiid, {$set : {title : wiki.title, description : wiki.description }});
		return wikiid;
	},
	wikiDestructor : function(id){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		return Wikis.remove(id);
	},
	workCreator : function(shop, type, rdv, workers, wiki){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		if(_.isArray(rdv)){
			return rdv.map(function(_rdv){
				return Works.insert({
					shop : shop,
					type : type,
					rdv : _rdv,
					worker_ids : workers,
					wiki_ids : wiki?[wiki] : [],
					schedular : {}
				});
			});
		}
		return Works.insert({
			shop : shop,
			type : type,
			rdv : rdv,
			worker_ids : workers,
			wiki_id : wiki,
			schedular : {}
		});
	},
	workAddWorker : function(workId, workerId){
		var works = Works.findOne(workId);
		return Works.update(workId, {
			$set : {
				worker_ids : (works.worker_ids||[]).concat(workerId)
			}
		});
	},
	workerSchedule : function( workId, workerId, action, datetime){
		console.log("TODO : methods (workerSchedule) - WORKS FILERING");
		Works.find().fetch().map(function(work){
			var schedular = work.schedular || {};
			schedular[workerId] = schedular[workerId] || [];
			schedular[workerId] =	schedular[workerId]
									.map(function(schedule){
										schedule.stop = schedule.stop || datetime;
										return schedule;
									});
			Works.update(work._id, {$set : {schedular : schedular}});
		});
		
		var work = Works.findOne(workId);
		var schedular = work.schedular || {};
		schedular[workerId] = schedular[workerId] || [];
		if(action === "start"){
			schedular[workerId].push({
				start : datetime
			});
		}
		return Works.update(workId, {$set : {schedular : schedular}});
	},
	workCloser : function(workId, end){
		/* STOP ALL WORKING + SAVE END DATE */
		var work = Works.findOne(workId);
		work.schedular = work.schedular||{};
		_
		.keys(work.schedular)
		.map(function(workerId){
			work.schedular[workerId] = work.schedular[workerId].map(function(schedule){
				schedule.stop = schedule.stop ||end;
				return schedule;
			});
		});
		return Works.update(work._id, {
			$set : {
				schedular : work.schedular,
				end : end
			}
		});
	},
	checkTVA : function(tva){
		if(Meteor.isServer){
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
		}
	}
});