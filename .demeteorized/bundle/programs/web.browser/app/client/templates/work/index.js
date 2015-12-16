(function(){"use strict";
/*global Works : false */
/*global Meteor : false */
/*global Session : false */
/*global Template : false */


Template.workIndex.helpers({
	works : function(){
		return Session.equals(Meteor.LIST_CALENDAR_SWITCHER, true) ? this.works : Works.find();
	},
	listView : function(){
		return Session.equals(Meteor.LIST_CALENDAR_SWITCHER, true);
	},
	pager : function(){
		var self = this;
		var max = 3;
		var result = [];
		var getQuery = function(key){
			if(key==1){
				return {
					date : moment(self.works.date).subtract(1, "month").format("MMMYYYY"),
					data : "date="+moment(self.works.date).subtract(1, "month").toISOString()
				}
			}
			else if(key==max){
				return {
					date : moment(self.works.date).add(1, "month").format("MMMYYYY"),
					data : "date="+moment(self.works.date).add(1, "month").toISOString()
				}
			}
			else{
				return {
					date : moment().format("MMMYYYY"),
					data : ""
				}
			}
		};
		for(var key = 1; key<=max ; key++){
			result.push({
				first : key==1,
				last : key==max,
				key : key,
				query : getQuery(key),
				shopId : self.shopId
			});
		}
		return result;
	},
});

Template.workIndex.events({
	"click .listCalSwitcher" : function(){
		Session.set(Meteor.LIST_CALENDAR_SWITCHER, !Session.get(Meteor.LIST_CALENDAR_SWITCHER));
		return false;
	}
});

}).call(this);
