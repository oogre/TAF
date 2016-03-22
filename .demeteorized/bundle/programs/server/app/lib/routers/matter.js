(function(){/* MATTERS */

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
			Session.set(Meteor.PAGE_TITLE, "Edition du matériel : "+s.capitalize(data.name));
		}
		this.render("matteredit");
	}
});
Router.route("/matter/:matterId", {
	controller : "ApplicationController",
	name: "matter.show",
	data : function(){
		return {
			matter : Matters.findOne(this.params.matterId),
		};
	},
	action : function () {
		var data = this.data();
		if(data){
			Session.set(Meteor.PAGE_TITLE, "Détail du matériel : "+s.capitalize(data.matter.name));
		}
		this.render("mattershow");
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
}).call(this);

//# sourceMappingURL=matter.js.map
