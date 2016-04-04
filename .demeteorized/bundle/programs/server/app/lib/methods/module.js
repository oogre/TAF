(function(){"use strict";
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
			throw new Meteor.Error("not authorized", "Vous devez être un Chef pour créer un module");
		}
		if(!Match.test(module, Object)){
			throw new Meteor.Error("wrong formatting object", "Aucune donnée reçue");
		}
		if(!Match.test(module.name, String)){
			throw new Meteor.Error("wrong formatting module.name", "Ajouter au moins un nom pour ce module");
		}
		if(!Match.test(module.type, String)){
			throw new Meteor.Error("wrong formatting module.type", "Ajouter au moins un type pour ce client");
		}

		this.unblock();

		module.name = module.name.toLowerCase();
		module.type = module.type.toLowerCase();
		var _module = Modules.findOne({
						name : module.name
					});

		if(_module){
			throw new Meteor.Error("non unique module.name", "Un module porte déjà ce nom");
		} 
		
		this.unblock();

		var moduleId = Modules.insert(module);
		
		if(this.isSimulation && button){
			$(button)
			.removeClass("btn-primary")
			.addClass("btn-success");
			Router.go("module.index");
			Session.set("successMessage", "Le module à été ajouter" );
		}
		return "Le module à été ajouter";
	},
	/*
		id : Matter._id
	*/
	moduleDestroyer: function (id) {
		if (! Meteor.isBoss()) {
			return new Meteor.Error("not authorized", "Vous devez être un Boss pour supprimer un module");
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
			throw new Meteor.Error("not authorized", "Vous devez être un Chef pour modifier un module");
		}
		if(!Match.test(id, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Modules.findOne(id);
		}))){
			throw new Meteor.Error("unknown module", "Le module que vous voulez modifier n'existe pas");
		}
		if(!Match.test(module, Object)){
			throw new Meteor.Error("wrong formatting object", "Aucune donnée reçue");
		}
		if(!Match.test(module.name, String)){
			throw new Meteor.Error("wrong formatting object.name", "Ajouter au moins un nom pour ce module");
		}
		if(!Match.test(module.type, String)){
			throw new Meteor.Error("wrong formatting object.type", "Ajouter au moins un type pour ce module");
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
			throw new Meteor.Error("wrong formatting object.name", "Un module porte déjà ce nom");
		}

		this.unblock();
		
		Modules.update(id, module);

		if(this.isSimulation && button){
			$(button)
			.removeClass("btn-primary")
			.addClass("btn-success");
			Router.go("module.index");
			Session.set("successMessage", "Le module à été modifier" );
		}
		return "Le module à été modifier";
	}
});
}).call(this);
