"use strict";
/*global Template : false */
/*global Meteor : false */
/*global Works : false */
/*global $ : false */

var getEvents = function (start, end) {
	return Works.find({
		rdv : {
			$gte: start.toISOString(),
			$lte: end.toISOString()
		}
	});
};
var mapDbEventsToEventSource = function (eventCursor) {
  var eventArray = [];
  eventCursor.forEach(function (eventData) {
    var title = eventData.type + " chez " + eventData.shop.name;
    if (eventData.isPrivate) {
      title += " - PRIVATE";
    }
    var color = "#3a87ad";
    if (eventData.ownerId !== Meteor.userId()) {
      color = "#ad433a";
    }
    var event = {
      title: title,
      start: eventData.rdv,
      //end: eventData.end,
      /*allDay: true,*/
      color: color
    };
    eventArray.push(event);
  });
  return eventArray;
};

Template.calendar.rendered = function () {
	$("#calendar").fullCalendar({
		height: $(window).height() - $("#calendar").offset().top,
		defaultView : "basicDay",
		header: {
			center: "prev title next",
			left : "month,basicDay",
			right: "today"
		},
		lang : "fr",
		editable: false,
		events: function (start, end, timezone, callback) {
			var events = getEvents(start, end);
			var eventSource = mapDbEventsToEventSource(events);
			callback(eventSource);
		},
		selectable: true,
		select: function (start, end, allDay) {

		}
	});
};