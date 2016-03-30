"use strict";
/*global _ : false */
/*global $ : false */
/*global Units : false */
/*global Meteor : false */
/*global Matters : false */
/*global Tracker : false */
/*global Session : false */
/*global Template : false */

var units = [];
var matters = [];
Template.matterselector.helpers({
	units : function(){
		units = Units.find({}).fetch();
		return units;
	},
	matters: function(query, callback){
		matters =	Matters.find({
						name : {
							$regex : ".*"+query.toLowerCase()+".*"
						}
					}).fetch();

		callback(	matters
					.map(function(it){
						return {
							value: it.name
						};
					})
		);
	},
	inti : function(){
		var self = this;
		Tracker.autorun(function () {
			var matter = Session.get(Meteor.MATTER);
			var inputReset = "select[name='unit'], input[name='quantity'], input[name='matter']";
			if (matter && matter.quantity && matter.name && (matter.unit||matter.unit==="") && self && self.work){
				var originId = $("select[name='origin']").val();
				var destinyId = $("select[name='destiny']").val();

				Session.set(Meteor.MATTER, false);

				if(originId){
					Meteor.call("moveCreator", {
						workId : self.work._id,
						quantity : matter.quantity,
						destinyId : destinyId,
						originId : originId,
						dateTime : moment().toISOString()
					});
				}

				Meteor.call("workMatter", self.work._id, matter, inputReset, function(){
					$(inputReset).val("");
				});
			}
		});
	},
	origins : function(){
		var matter = Session.get(Meteor.MATTER);
		if(matter && matter._id){
			return Origins.find({
				matter : matter._id,
			}).fetch()
		}
		return false;
	},
	destins : function(){
		if(this && this.work && this.work.shop && this.work.shop._id){
			var shop = Shops.findOne(this.work.shop._id);
			if(shop){
				return shop.modules;
			}
		}
		return false;
	}
});
Template.matterselector.destroyed = function(){
Session.set(Meteor.MATTER, false);
};
Template.matterselector.rendered = function(){
	Session.set(Meteor.MATTER, false);
	Meteor.typeahead.inject();
	$(".twitter-typeahead").addClass("form-control");
	$(".typeahead")
	.css("boxShadow","none")
	.first()
	.css("opacity", "0");
};

Template.matterselector.events({
	"blur input[name='matter']" : function(event){
		var _matter, s_matter, _unit;
		s_matter = Session.get(Meteor.MATTER)||{};
		s_matter.name = event.target.value.toLowerCase();
		_matter =	_
					.find(matters, function(matter){
						return s_matter.name === matter.name;
					});
		if(_matter && (_unit = $("select[name='unit'] option[value='"+_matter.unit+"']"))) {
			_unit[0].selected = true;
			_unit.parent().attr("disabled", "disabled");
			Session.set(Meteor.MATTER, _matter);
		}
		else{
			Session.set(Meteor.MATTER, s_matter);
			$("select[name='unit']").removeAttr("disabled");
		}
	},
	"blur input[name='quantity']" : function(event){
		var matter = Session.get(Meteor.MATTER)||{};
		matter.quantity = event.target.value.toLowerCase();
		Session.set(Meteor.MATTER, matter);
	},
	"change select[name='unit']" : function(event){
		var matter = Session.get(Meteor.MATTER)||{};
		matter.unit = event.target.value.toLowerCase();
		Session.set(Meteor.MATTER, matter);
	},
	"change select.barcode" : function(event){
		if(Meteor.isCordova && event.target.value == "barcode"){
			cordova.plugins.barcodeScanner.scan(
				function (result) {
					$(event.target)
					.find("option")
					.each(function(k, elem){
						if($(elem).html() == result.text){
							$(event.target).val($(elem).val());
						}
					});
				}, 
				function (error) {
					alert("Scanning failed: " + error);
				}
			);
		}
	}
});