"use strict";
/*global Modules : false */
/*global Template : false */

Template.shopmodule.helpers({
	modules : function(){
		var self = this;
		return (self.modules||[]).map(function(modules){
			modules.modules = modules.modules.map(function(module){
				module.shopId = self.shop._id;
				return module;
			});
			return modules;
		});
	},
	shopModules : function(){
		if(this.shop){
			var self = this;
			return (this.shop.modules||[]).map(function(module, key){
				return {
					module : Modules.findOne(module.id),
					tasks : module.tasks,
					shop : self.shop,
					key : key
				};
			});
		}
	}
});
