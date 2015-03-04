"use strict";
/*global _ : false */
/*global $ : false */
/*global Npm : false */
/*global HTTP : false */
/*global Email : false */
/*global Shops : false */
/*global Wikis : false */
/*global Works : false */
/*global Router : false */
/*global moment : false */
/*global Session : false */
/*global Meteor : false */
/*global Workers : false */
/*global Accounts : false */


Meteor.methods({
	serverIP : function(){
		return Meteor.serverIP;
	},

/* WORKER */
	workerUpdator: function (workerid, worker) {
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		return Workers.update(workerid, {$set : {profile : worker}});
	},
	workerCreator: function (worker, button) {
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();

		if(Meteor.isServer){
			var Future = Npm.require("fibers/future");
			var myFuture = new Future();
			var url = "https://passwordwolf.com/api/?upper=off&special=off&length=10&repeat=1";
			
			HTTP.get(url, {
				followRedirects : true
			}, function (error, result) {
				if(error) myFuture.throw(error);
				if(result.statusCode != 200) myFuture.throw(new Meteor.Error("statusCode-"+result.statusCode));
				try{
					var body = JSON.parse(result.content);
					worker.password = body[0].password;

					var account = Accounts.createUser(worker);

					Email.send({
						to: worker.email,
						from: "robot@taf.com",
						subject: "Welcom on TAF",
						text: "GO and connect on TAF. email : "+worker.email+" password : "+worker.password
					});

					myFuture.return(account);
				}catch(e){
					 myFuture.throw(new Meteor.Error("statusCode-"+result.statusCode));
				}
			});
			return myFuture.wait();

		}
		
		if(this.isSimulation){
			$(button)
			.removeClass("btn-primary")
			.addClass("btn-success");
			Router.go("home");
		}
	},
	workerSchedule : function( workId, workerId, action, datetime){
		this.unblock();
		Works
		.find({
			$where : function(){
				return _.find(this.schedular[workerId], function(schedule){
					return schedule.start && !schedule.stop;
				});
			}
		})
		.fetch()
		.map(function(work){
			var schedular = work.schedular || {};
			schedular[workerId] = schedular[workerId] || [];
			schedular[workerId] =	schedular[workerId]
									.map(function(schedule){
										schedule.stop = schedule.stop || datetime;
										return schedule;
									});
			Works
			.update(work._id, {
				$set : {
					schedular : schedular
				}
			});
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
/* SHOP */
	easyShopCreator : function(shop){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		if(!shop.name || !shop.contacts || !shop.contacts.length){
			return new Meteor.Error("name-contact-minimal-data");
		}	
		this.unblock();
		return Shops.insert(shop);
	},
	shopCreator : function(shop, button){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		if(!shop.name || !shop.contacts || !shop.contacts.length){
			return new Meteor.Error("name-contact-minimal-data");
		}
		this.unblock();
		if(!Shops.findOne({name : shop.name})){
			var shopId = Shops.insert(shop);

			if(Meteor.isServer && shop.address.street && shop.address.number && shop.address.city && shop.address.zipcode){
				Meteor.geocode(shop.address.street+" "+shop.address.number+" "+shop.address.city+" "+shop.address.zipcode, function(error, location){
					if(error)return ;
					shop.location = location;
					Shops.update(shopId, shop);	
				});
			}
			
			if(this.isSimulation){
				$(button)
				.removeClass("btn-primary")
				.addClass("btn-success");
				Router.go("shop.index");
			}
			return shopId;
		}
	},
	shopUpdator : function(shopId, shop, button){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		if(!shop.name || !shop.contacts || !shop.contacts.length){
			return new Meteor.Error("name-contact-minimal-data");
		}

		this.unblock();
		if(!Shops.findOne({_id : {$ne : shopId},name : shop.name})){

			Shops.update(shopId, shop);

			if(Meteor.isServer && shop.address.street && shop.address.number && shop.address.city && shop.address.zipcode){
				Meteor.geocode(shop.address.street+" "+shop.address.number+" "+shop.address.city+" "+shop.address.zipcode, function(error, location){
					if(error)return;
					shop.location = location;
					Shops.update(shopId, shop);	
				});
			}

			if(this.isSimulation){
				$(button)
				.removeClass("btn-primary")
				.addClass("btn-success");
				Router.go("shop.index");
			}
			return true;
		}
	},
	checkTVA : function(tva){
		this.unblock();
		if(Meteor.isServer){
			return Meteor.checkTVA(tva);
		}
	},

/* WIKI */
	wikiCreator : function(workId){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		var currentWiki = Wikis.insert({
			createdAt : moment().toISOString(),
			uploads: [], 
			description:""
		});
		if(workId){
			Works.update(workId, {
				$push : {
					wiki_id : currentWiki
				}
			});
		}
		if(this.isSimulation){
			Session.set(Meteor.WIKI_CURRENT_KEY, currentWiki);
		}
		return currentWiki;
	},
	wikiUpdator: function (wikiid, wiki) {
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		Wikis.update(wikiid, {
			$set : wiki
		});
		return wikiid;
	},
	wikiUploadUpdator: function (wikiid, uploads) {
		this.unblock();
		var raw = _.isString(uploads) || (Wikis.findOne(wikiid) && (true === Wikis.findOne(wikiid).raw));
		Wikis.update({_id: wikiid}, { 
			$push: { 
				uploads: uploads 
			},
			$set : {
				raw : raw
			} 
		});
		return wikiid;
	},
	wikiDestructor : function(id){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		return Wikis.remove(id);
	},

/* WORK */
	workCreator : function(shop, type, rdv, workers, wiki){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		var schedular = (function(keys){
			var obj ={};
			(keys||[]).map(function(key){
				obj[key] = [];
			});
			return obj;
		}(workers));

		var result;
		if(_.isArray(rdv)){
			result = rdv.map(function(_rdv){
				return Works.insert({
					shop : shop,
					type : type,
					rdv : _rdv,
					worker_ids : workers,
					wiki_id : wiki?[wiki] : [],
					schedular : schedular
				});
			})[0];
		}else{
			result = Works.insert({
				shop : shop,
				type : type,
				rdv : rdv,
				worker_ids : workers,
				wiki_id : wiki?[wiki] : [],
				schedular : schedular
			});
		}


		if(this.isSimulation){
			Router.go("work.show", {workId : result});
		}
		return result;
	},
	workAddWorker : function(workId, workerId){
		var works = Works.findOne(workId);
		this.unblock();
		return Works.update(workId, {
			$set : {
				worker_ids : (works.worker_ids||[]).concat(workerId)
			}
		});
	},
	workCloser : function(workId, end){
		this.unblock();
		/* STOP ALL WORKING + SAVE END DATE */
		var work = Works.findOne(workId);
		work.schedular = work.schedular||{};
		_
		.keys(work.schedular)
		.map(function(workerId){
			work.schedular[workerId] = work.schedular[workerId].map(function(schedule){
				schedule.stop = schedule.stop || end;
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
	workReopener : function(workId){
		this.unblock();
		/* STOP ALL WORKING + SAVE END DATE */
		return Works.update(workId, {
			$unset : {
				end : ""
			}
		});
	},
	workRdvUpadtor : function(workId, date){
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		return Works.update(workId, {$set : {rdv : date}});
	},
	workDestructor : function(id){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		Works.remove(id);
		if(Meteor.isSimulation){
			Router.go("home");
		}
	}
});