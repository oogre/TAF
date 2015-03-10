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
			return	_
					.chain(
						this.modules
					)
					.groupBy(function(module){
						if(module)
							return module.type;
					})
					.map(function(modules,key){
						if(modules)
							return {
								type: key, 
								modules: modules.map(function(module){
									module.view = true;
									return module;
								})
							};
					})
					.sortBy(function(modules){
						if(modules)
							return modules.type;
					})
					.value();
		}
	}
});