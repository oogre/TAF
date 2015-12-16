(function(){/* MODULES */

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
}).call(this);
