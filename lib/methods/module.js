"use strict";
/*global $ : false */
/*global Router : false */
/*global Meteor : false */
/*global Modules : false */

Meteor.methods({
	/*
		module : { 
			name: String uniq, 
			type: String 
		},
		button : cssSelector
	*/
	moduleCreator : function(module, button){
		if (!Meteor.isChief()) {
			return new Meteor.Error("not authorized", "You have to be a chief");
		}
		if(!Match.test(module, Object)){
			return new Meteor.Error("wrong formatting object");
		}
		if(!Match.test(module.name, String)){
			return new Meteor.Error("wrong formatting object.name", "Unknow Name : "+module.name);
		}
		if(!Match.test(module.type, String)){
			return new Meteor.Error("wrong formatting object.type", "Unknow Type : "+module.type);
		}

		this.unblock();

		module.name = module.name.toLowerCase();
		module.type = module.type.toLowerCase();

		if(Match.test(module.name, Match.Where(function(name){
			return 	Modules.findOne({
						name : name
					});
		}))){
			return Modules.findOne({
				name : module.name
			})._id;
		} 
		
		this.unblock();

		var moduleId = Modules.insert(module);
		
		if(this.isSimulation && button){
			$(button)
			.removeClass("btn-primary")
			.addClass("btn-success");
			Router.go("module.index");
		}
		return moduleId;
	},
	/*
		id : Matter._id
	*/
	moduleDestroyer: function (id) {
		if (! Meteor.isBoss()) {
			return new Meteor.Error("not authorized", "You have to be a boss");
		}
		this.unblock();
		Modules.remove(id);
		if(this.isSimulation){
			Session.set("successMessage", "Le module à été supprimé" );
		}
		return "Le module à été supprimé";
	},

	/*
		id : Modules._id,
		module : { 
			name: String uniq, 
			type: String
		},
		button : cssSelector
	*/
	moduleUpdator : function(id, module, button){
		if (! Meteor.isChief()) {
			return new Meteor.Error("not authorized", "You have to be a chief");
		}
		if(!Match.test(id, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Modules.findOne(id);
		}))){
			return new Meteor.Error("unknown module", "You probably type a wrong id : "+id);
		}
		if(!Match.test(module, Object)){
			return new Meteor.Error("wrong formatting object");
		}
		if(!Match.test(module.name, String)){
			return new Meteor.Error("wrong formatting object.name", "Unknow Name : "+module.name);
		}
		if(!Match.test(module.type, String)){
			return new Meteor.Error("wrong formatting object.type", "Unknow Type : "+module.type);
		}

		module.name = module.name.toLowerCase();
		module.type = module.type.toLowerCase();

		if(Match.test(module.name, Match.Where(function(name){
			return 	Modules.findOne({
						_id : {
							$ne : id
						},
						name : name
					});
		}))){
			return new Meteor.Error("wrong formatting object.name", "Uniq name needed : "+module.name);
		}

		this.unblock();
		
		Modules.update(id, module);

		if(this.isSimulation && button){
			$(button)
			.removeClass("btn-primary")
			.addClass("btn-success");
			Router.go("module.index");
		}
		return true;
	}
});