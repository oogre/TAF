/* SHOP */

Router.route("/shop", {
	controller : "CleanController",
	name: "shop.index",
	action : function () {
		Session.set(Meteor.PAGE_TITLE, "Liste des Magasins/Clients");
		this.render("shopindex");
		if(Meteor.isWorker()){
			Session.set(Meteor.FILL_CONTEXT_MENU_KEY, true);
			this.render("shopaction", {to : "action"}); //contextmenu.action
		}
	},
	data : function(){
		var skip = parseInt(this.params.query.skip) || Meteor.indexSkip;
		var limit = parseInt(this.params.query.limit) || Meteor.indexLimit;
		var where = this.params.query.where || {};

		if(_.isString(where)){
			where = where.toLowerCase();
			where = where.replace(/\.|\\|\+|\*|\?|\[|\^|\]|\$|\(|\)|\{|\}|\=|\!|\>|\||\:|\-/g, "");
			where = {
				$or : [{
					name : {
						$regex : ".*"+where+".*"
					}
				}, {
					brand : {
						$regex : ".*"+where+".*"
					}
				}]
			};
		}
		
		return {
			shops : Shops.find(where,{
				skip: skip,
				limit: limit,
				sort : {
					brand : 1
				} 
			}),
			count : Shops.find(where).count(),
			where : this.params.query.where||"",
			limit : limit,
			skip : skip
		};
	}
});



Router.route("/shop/new", {
	controller : "ApplicationController",
	name: "shop.new",
	action : function () {
		Session.set(Meteor.PAGE_TITLE, "Créer un nouveau Magasins/Clients");	
		this.render("shopnew");
	}
});



Router.route("/shop/edit/:id", {
	controller : "CleanController",
	name: "shop.edit",
	data : function(){
		return Shops.findOne(this.params.id); 
	},
	action : function () {
		var data = this.data();
		if(data){
			Session.set(Meteor.PAGE_TITLE, "Edition "+s.capitalize(data.name)+" - "+s.capitalize(data.brand));	
		}
		this.render("shopedit");
		if(Meteor.isBoss()){
			Session.set(Meteor.FILL_CONTEXT_MENU_KEY, true);
			this.render("shopeditaction", {to : "action"}); //contextmenu.action
		}
	}
});



Router.route("/shop/:id", {
	controller : "ApplicationController",
	name: "shop.view",
	data : function(){
		var date = moment(this.params.query.date || undefined);
		date = moment([date.year(), date.month()]);

		var start = _.clone(date).startOf('month').toISOString();
		var stop = _.clone(date).endOf('month').toISOString();

		var where = {
			"shop._id" : this.params.id, 
			rdv : {
				$gte: start,
				$lte: stop
			}
		};
		var tmp = 	_
					.chain(
						Works
						.find(where, {
							sort : {
								rdv : -1
							}
						})
						.fetch()
					)
					.map(function(work){
						work.rdv = moment(work.rdv).format("dd DD MMM HH:mm");//.format("DD/MM/YY HH:mm");
						return work;
					})
					.groupBy(function(work){
						return work.end;
					})
					.value();
		var unfinished = tmp.undefined || [];
		var torun = [];
		unfinished = 	unfinished
						.map(function(work){
							if( _
								.chain(work.schedule)
								.pluck("timetable")
								.flatten()
								.map(function(item){
									return  item && item.start;
								})
								.some()
								.value()
							){
								return work;
							}else{
								torun.push(work);
								return false;
							}
						});
		unfinished = _.compact(unfinished)

		delete tmp.undefined;		
		return{
			works : {
				count : Works.find(where).count(),
				date : date.toISOString(),
				torun : torun.reverse(),
				unfinished : unfinished,
				finished : 	_
							.chain(tmp)
							.values()
							.flatten()
							.map(function(work){
								work.depannage = work.type == "dépannage";
								work.installation = work.type == "installation";
								work.entretien = work.type == "maintenance";
								return work;
							})
							.value()
			},
			shop : Shops.findOne(this.params.id)
		};
	},
	action : function () {
		var data = this.data();
		if(data){
			Session.set(Meteor.PAGE_TITLE, s.capitalize(data.shop.name)+" - "+s.capitalize(data.shop.brand));	
		}
		this.render("shopview");
	}
});



Router.route("/shop/modules/:id", {
	controller : "ApplicationController",
	name: "shop.modules",
	data : function(){
		var shopId = this.params.id;
		return {
			shop : Shops.findOne(shopId),
			modules : 	Modules
						.find({}, {
							sort : {
								type : 1
							}
						})
						.fetch()
						.map(function(module){
							module.shopId = shopId;
							return module;
						})
		};
	},
	action : function () {
		var data = this.data();
		if(data && data.shop){
			Session.set(Meteor.PAGE_TITLE, "Edition des modules de "+s.capitalize(data.shop.name)+" - "+s.capitalize(data.shop.brand));	
		}
		this.render("shopmodules");
	}
});