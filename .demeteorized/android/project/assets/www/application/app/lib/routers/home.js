(function(){/* HOME */

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
}).call(this);
