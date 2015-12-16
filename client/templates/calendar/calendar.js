"use strict";
/*global $ : false */
/*global Deps : false */
/*global Works : false */
/*global Router : false */
/*global moment : false */
/*global Meteor : false */
/*global Session : false */
/*global Template : false */

var getWorks = function (start, end) {
	start = start.subtract(1, "day").toISOString();
	end = end.toISOString();
	return Works.find({
		$or : [{
				rdv : {
					$gte: start,
					$lte: end
				}
			},{
				end : {
					$exists: false
				}
			},{
				end : ""
			},{
				end : {
					$gte: start,
					$lte: end
				}
			}]
	})
	.fetch();
};
var mapWorkToEvent = function (works) {
	return 	works
			.map(function (work) {
				var color;
				switch(work.type){
					case "installation":
						color = "#3A51AD";
						break;
					case "maintenance":
						color = "#6D3AAD";
						break;
					default:
						color = "#AD433A";
						break;
				}
				if(work && work.signatures && work.signatures.client && work.signatures.adf ){
					color = "#9F9F9F";
				}
				else if(work.end){
					color = "#333";
				}
				return {
					title: work.shop.name,
					start: work.rdv,
					end: work.end || moment().toISOString(),
					color: color,
					id : work._id
				};
			});
};

Template.calendar.rendered = function () {
	$("#calendar").fullCalendar({
		timezone : "local",
		height: $(window).height() - $("#calendar").offset().top,
		defaultDate : Session.get(Meteor.CALENDAR_CONF).defaultDate,
		defaultView : Session.get(Meteor.CALENDAR_CONF).defaultView,
		header: {
			center: "prev title next",
			left : "month,basicDay",
			right: "today"
		},
		lang : "fr",
		editable: false,
		events: function (start, end, timezone, next) {
			var works = getWorks(start, end);
			next(mapWorkToEvent(works));
		},
		eventClick: function(calEvent) {
			Router.go("work.show", {
				workId:calEvent.id
			});
		},
		eventAfterAllRender : function(view){
			Session.set(Meteor.CALENDAR_CONF, {
				defaultView : view.name,
				defaultDate : view.calendar.getDate().format()
			});
		}
	});

	Deps.autorun(function(c) {
		if (Works.find().count()) {
			if(!c.firstRun){
				if($("#calendar").length){
					$("#calendar").fullCalendar("refetchEvents");
				}else{
					c.stop();
				}
			}
		}
	});
};