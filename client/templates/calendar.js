"use strict";
/*global Template : false */

Template.calendar.helpers({
    options: function() {
        return {
            defaultView: "agendaDay",
            lang : "fr",
            events: [
				{
					title  : "event1",
					start  : "2015-02-01",
					color: "black",     // an option!
            		textColor: "yellow" // an option!
				},
				{
					title  : "event2",
					start  : "2015-02-01",
					end    : "2015-02-03"
				},
				{
					title  : "event3",
					start  : "2015-02-01T12:30:00",
					allDay : false // will make the time show
				},
				{
					title  : "event4",
					start  : "2015-02-01T12:50:00",
					end    : "2015-02-03T12:50:00"
				}
			]
        };
    }
});