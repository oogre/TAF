(function(){/* WORK */

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
}).call(this);

//# sourceMappingURL=work.js.map
