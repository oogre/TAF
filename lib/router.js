/*global _ : true */
/*global s : true */
/*global Picts : true */
/*global Works : true */
/*global Wikis : true */
/*global Shops : false */
/*global Tasks : false */
/*global Meteor : false */
/*jshint strict : false */
/*global Router : false */
/*global Modules : false */
/*global Matters : false */
/*global Workers : false */
/*global console : false */
/*global Session : false */
/*global BaseController : true */
/*global RouteController : true */
/*global CleanController : true */
/*global ApplicationController : true */


var IR_BeforeHooks = {
	isLoggedIn: function(router) {
		return Meteor.loggingIn() || Meteor.user()
	},
	resetWiki: function() { 
		Session.set(Meteor.WIKI_CURRENT_KEY, false);
		Session.set(Meteor.WIKI_OPEN_LIST, false);
		Session.set(Meteor.WIKI_LIST, false);
	},
	resetMenu: function() { 
		Session.set(Meteor.FILL_CONTEXT_MENU_KEY, false);
		Session.set(Meteor.ADD_WORKER, false);
	}
};

BaseController = RouteController.extend({
	layoutTemplate: "layout",
	before: function () {
		IR_BeforeHooks.resetMenu();
		this.next();
	},
	action: function () {
		console.log("this should be overridden!");
	}
});

ApplicationController = BaseController.extend({
	before: function () {
		if( ! IR_BeforeHooks.isLoggedIn()){
			this.redirect("signin");
		}
		this.next();
	},
	action: function () {
		console.log("this should be overridden!");
	}
});

CleanController = ApplicationController.extend({
	before: function () {
		IR_BeforeHooks.resetWiki();
		this.next();
	},
});

Router.configure({
});

/* HOME */
	Router.route("/", {
		controller : "CleanController",
		name: "home",
		action : function () {
			if(	Shops.find().count()==0 || 
				Units.find({}).count() == 0 || 
				//Works.find({}).count() == 0 || 
				Workers.find({}).count() == 0)
			{
				return this.render("loadingTemplate");
			}
			Session.set(Meteor.PAGE_TITLE, "TAF");
			this.render("workIndex");
			if(Meteor.isWorker()){
				Session.set(Meteor.FILL_CONTEXT_MENU_KEY, true);
				this.render("work-action", {to : "action"}); //contextmenu.action	
			}
		}
	});

/* SIGN */
	Router.route("/signout", {
		controller : "CleanController",
		name: "user.signout",
		action : function () {
			Meteor.logout();
			this.redirect("/");
		}
	});

	Router.route("/signup", {
		controller : "BaseController",
		name: "user.signup",
		action : function () {
			this.render("signup");
		}
	});

	Router.route("/signin", {
		controller : "BaseController",
		name: "signin",
		action : function () {
			this.render("signin");
		}
	});


/* SHOP */
	Router.route("/shop", {
		controller : "CleanController",
		name: "shop.index",
		action : function () {
			Session.set(Meteor.PAGE_TITLE, "Liste des Magasins/Clients");
			this.render("shopindex");
			if(Meteor.isBoss()){
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

	Router.route("/shop/edit/:shopId", {
		controller : "CleanController",
		name: "shop.edit",
		data : function(){
			return Shops.findOne(this.params.shopId); 
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

	Router.route("/shop/:shopId", {
		controller : "ApplicationController",
		name: "shop.view",
		data : function(){
			var date = this.params.query.date || moment();
			var start = moment(date).subtract(1, "month").toISOString();
			var stop = moment(date).add(1, "month").toISOString();
			where = {
				"shop._id" : this.params.shopId, 
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
									.chain(work.schedular)
									.keys()
									.map(function(worker){
										return  work.schedular[worker].length > 0;
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
					date : date,
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
				shop : Shops.findOne(this.params.shopId)
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

	Router.route("/shop/modules/:shopId", {
		controller : "ApplicationController",
		name: "shop.modules",
		data : function(){
			var shopId = this.params.shopId;
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

/* MODULES */
	Router.route("/module/new", {
		controller : "ApplicationController",
		name: "module.new",
		action : function () {
			Session.set(Meteor.PAGE_TITLE, "Nouveau Module");
			this.render("modulenew");
		}
	});

	Router.route("/module/edit/:moduleId", {
		controller : "ApplicationController",
		name: "module.edit",
		data : function(){
			return Modules.findOne(this.params.moduleId);
		},
		action : function () {
			var data = this.data();
			if(data){
				Session.set(Meteor.PAGE_TITLE, "Edition du module : "+s.capitalize(data.name)+" - "+s.capitalize(data.type));	
			}
			this.render("moduleedit");
		}
	});

	Router.route("/module", {
		controller : "CleanController",
		name: "module.index",
		data : function(){
			return {
				modules : 	_
							.chain(Modules.find().fetch())
							.groupBy(function(module){
								return module.type;
							})
							.map(function(val,key){
								return {
									type: key, 
									modules: val
								};
							})
							.sortBy(function(Modules){
								return Modules.type;
							})
							.value()
			};
		},
		action : function () {
			Session.set(Meteor.PAGE_TITLE, "Liste des Modules");
			this.render("moduleindex");
			if(Meteor.isBoss()){
				Session.set(Meteor.FILL_CONTEXT_MENU_KEY, true);
				this.render("moduleaction", {to : "action"}); //contextmenu.action
			}
		}
	});

/* TASKS */
	Router.route("/task/new", {
		controller : "ApplicationController",
		name: "task.new",
		action : function () {
			Session.set(Meteor.PAGE_TITLE, "Nouvelle tâche");
			this.render("tasknew");
		}
	});

	Router.route("/task", {
		controller : "CleanController",
		name: "task.index",
		data : function(){
			return {
				tasks : _
						.chain(Tasks.find().fetch())
						.groupBy(function(task){
							return task.moduletype;
						})
						.map(function(tasks){
							return {
								category : tasks[0].moduletype || "-",
								tasks : tasks
							};
						})
						.sortBy(function(task){
							return task.category;
						})
						.value()
			};
		},
		action : function () {
			Session.set(Meteor.PAGE_TITLE, "Liste des tâches");
			this.render("taskindex");
			if(Meteor.isBoss()){
				Session.set(Meteor.FILL_CONTEXT_MENU_KEY, true);
				this.render("taskaction", {to : "action"}); //contextmenu.action
			}
		}
	});

	Router.route("/task/edit/:taskId", {
		controller : "ApplicationController",
		name: "task.edit",
		data : function(){
			return Tasks.findOne(this.params.taskId);
		},
		action : function () {
			var data = this.data();
			if(data){
				Session.set(Meteor.TASK_INPUT_TEXT, data.value);
				Session.set(Meteor.PAGE_TITLE, "Edition de la tâche : "+s.capitalize(data.name));
			}
			this.render("taskedit");
		}
	});


/* WORKER */
	Router.route("/worker", {
		controller : "CleanController",
		name: "worker.index",
		action : function () {
			Session.set(Meteor.PAGE_TITLE, "List des travailleurs");
			this.render("workerindex");
			if(Meteor.isBoss()){
				Session.set(Meteor.FILL_CONTEXT_MENU_KEY, true);
				this.render("workeraction", {to : "action"}); //contextmenu.action
			}
		},
		data : function(){
			return {
				worker_ids : Workers.find().fetch().map(function(worker){return worker._id;})
			};
		}
	});

	Router.route("/worker/new", {
		controller : "ApplicationController",
		name: "user.new",
		data : function(){
			return this.params;
		},
		action : function () {
			Session.set(Meteor.PAGE_TITLE, "Nouveau travailleurs");
			this.render("workernew");
		}
	});

	Router.route("/worker/edit/:workerId", {
		controller : "CleanController",
		name: "user.edit",
		data : function(){
			return Workers.findOne(this.params.workerId); 
		},
		action : function () {
			var data = this.data();
			if(data){
				Session.set(Meteor.PAGE_TITLE, "Editer la fiche de : "+s.capitalize(data.profile.firstname)+" "+s.capitalize(data.profile.lastname));	
			}
			this.render("workeredit");
		}	
	});


	Router.route("/worker/:workerId", {
		controller : "CleanController",
		name: "user.view",
		data : function(){
			return Workers.findOne(this.params.workerId); 
		},
		action : function () {
			var data = this.data();
			if(data){
				Session.set(Meteor.PAGE_TITLE, s.capitalize(data.profile.firstname)+" "+s.capitalize(data.profile.lastname));	
			}
			this.render("workerview");
		}	
	});


/* WORK */
	Router.route("/work/new", {
		controller : "ApplicationController",
		name: "work.new",
		data : function(){
			return this.params;
		},
		action : function () {
			Session.set(Meteor.PAGE_TITLE, "Nouvelle fiche de travail : "+decodeURIComponent(this.request.url.split("#")[1]));	
			this.render("work-new");
		}
	});

	Router.route("/work/:workId", {
		controller : "ApplicationController",
		name: "work.show",
		data : function(){
			var work = Works.findOne(this.params.workId);
			if(!work){
				return;
			}
			work.pictures = Picts.find({
								_id : {
									$in : work.pictures||[]
								}
							})
							.fetch()
							.map(function(pict){
								if(_.isString(pict.data)) return pict.data;
								return Meteor.pictureServer+"/"+pict.data.path;
							});
			work.wikis = Wikis.find({
							_id : {
								$in : work.wikis||[]
							}
						}, {
							sort :{
								createdAt : -1
							}
						});
			return work; 
		},
		action : function () {
			var data = this.data();
			if(data){
				Session.set(Meteor.PAGE_TITLE, s.capitalize(data.type)+" chez "+s.capitalize(data.shop.name));	
			}
			this.render("work-view");
			if(Meteor.isChief()){
				Session.set(Meteor.FILL_CONTEXT_MENU_KEY, true);
				this.render("work-viewaction", {to : "action"}); //contextmenu.action
			}
		}
	});

/* MATTERS */
	Router.route("/matter/new", {
		controller : "ApplicationController",
		name: "matter.new",
		action : function () {
			Session.set(Meteor.PAGE_TITLE, "Nouveau Matériel");
			this.render("matternew");
		}
	});

	Router.route("/matter/edit/:matterId", {
		controller : "ApplicationController",
		name: "matter.edit",
		data : function(){
			return Matters.findOne(this.params.matterId);
		},
		action : function () {
			var data = this.data();
			if(data){
				Session.set(Meteor.PAGE_TITLE, "Edition du matérial : "+s.capitalize(data.name));
			}
			this.render("matteredit");
		}
	});

	Router.route("/matter", {
		controller : "CleanController",
		name: "matter.index",
		data : function(){
			return {
				matters : Matters
							.find({

							},{
								sort : {
									name : 1
								}
							}).fetch()
			};
		},
		action : function () {
			Session.set(Meteor.PAGE_TITLE, "Liste des Matériels");
			this.render("matterindex");
			if(Meteor.isBoss()){
				Session.set(Meteor.FILL_CONTEXT_MENU_KEY, true);
				this.render("matteraction", {to : "action"}); //contextmenu.action
			}
		}
	});