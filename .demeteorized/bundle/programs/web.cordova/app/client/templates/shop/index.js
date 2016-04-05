(function(){"use strict";
/*global _ : false */
/*global Template : false */

Template.shopindex.destroyed = function(){
	Session.set(Meteor.CONTEXT_MENU_KEY, false);
};

Template.shopindex.helpers({
	pager : function(){
		var self = this;
		var max = Math.ceil(this.count/this.limit);
		var active = Math.ceil(this.skip/this.limit)+1;
		var result = [];
		var getQuery = function(key){
			if(key<1){
				return "where="+self.where+"&skip=0&limit="+self.limit;
			}
			else if(key>max){
				return "where="+self.where+"&skip="+((max-1)*self.limit)+"&limit="+self.limit;
			}
			else{
				return "where="+self.where+"&skip="+((key-1)*self.limit)+"&limit="+self.limit;
			}
		};

		for(var key = 0; key<=max+1 ; key++){
			result.push({
				first : key<1,
				last : key>max,
				key : key,
				active : active===key ? "active" : "",
				query : getQuery(key)
			});
		}
		return result;
	},
	isPager : function(){
		return this.count>this.limit;
	},
	isFiltered : function(){
		return _.isString(this.where) && this.where;
	},
	filter : function(){
		return this.where;
	},
	isNav : function(){
		return (_.isString(this.where) && this.where) || this.count>this.limit;	
	}
});
}).call(this);
