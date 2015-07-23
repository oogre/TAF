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
	},
	works : function(){
		var tmp = _
				.chain(
					Works
					.find({
						"shop._id" : this._id
					}, {
						sort : {
							rdv : -1
						}
					})
					.fetch()
				)
				.map(function(work){
					work.rdv = moment(work.rdv).format("DD/MM/YY");
					return work;
				})
				.groupBy(function(work){
					return work.end;
				})
				.value();
				var unfinished = tmp.undefined;

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
			torun : torun,
			unfinished : unfinished,
			finished : _.chain(tmp).values().flatten().value()
		};
		
		
				; 
	},
});