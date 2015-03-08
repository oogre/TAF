"use strict";
/*global _ : false */
/*global Modules : false */
/*global Template : false */


Template.shopview.helpers({
	location : function(){
		return this.location;
	},
	modules : function(){
		if(this.modules){
			return 	_
					.chain(
						this.modules
						.map(function(module){
							return Modules.findOne(module.id);
						})
					)
					.groupBy(function(module){
						return module.type;
					})
					.map(function(modules,key){
						return {
							type: key, 
							modules: modules.map(function(module){
								module.view = true;
								return module;
							})
						};
					})
					.sortBy(function(Modules){
						return Modules.type;
					})
					.value();
		}
	}
});