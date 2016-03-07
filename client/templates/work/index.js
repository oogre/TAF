"use strict";
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
			var date = moment(self.works.date);
			if(key==1){
				return {
					date : moment([date.year(), date.month()]).subtract(1, "month").format("MMMYYYY"),
					data : "date="+moment([date.year(), date.month()]).subtract(1, "month").format("YYYY-MM-01")
				}
			}
			else if(key==max){
				return {
					date : moment([date.year(), date.month()]).add(1, "month").format("MMMYYYY"),
					data : "date="+moment([date.year(), date.month()]).add(1, "month").format("YYYY-MM-01")
				}
			}
			else{
				return {
					date : moment().format("MMMYYYY"),
					data : "date="+moment().format("YYYY-MM-01")
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
