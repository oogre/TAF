"use strict";
/*global $ : false */
/*global Deps : false */
/*global Works : false */
/*global Router : false */
/*global moment : false */
/*global Template : false */

var getWorks = function (start, end) {
	return Works.find({
		$or : [{
			rdv : {
				$gte: start.toISOString(),
				$lte: end.toISOString()
			}
		},{
			end : {
				$exists: false
			}
		},{
			end : {
				$gte: start.toISOString(),
				$lte: end.toISOString()
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
				if(work.end){
					color = "#6F6F6F";
				}
				return {
					title: work.type + " chez " + work.shop.name,
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
		defaultView : "basicDay",
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