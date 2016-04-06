
var shop, module, origine, work;
Template.originshow.helpers({
	formatize : function(dateTime){
		return moment(dateTime).format("DD MMM YYYY");
	},
	setCurrent : function(destinyId){
		origine = false;
		module = false;
		work = Works.findOne(this.workId);
		if(work){
			shop = 	Shops.findOne(work.shop._id);
		}else{
			shop = 	Shops.findOne({
						modules : {
							$elemMatch: {
								serial : destinyId
							}
						}
					});
		}
		
		if(shop){
			module = _.find(shop.modules, function(item){
						return item.serial == destinyId;
					});
		}else{
			origine = Origins.findOne(destinyId);
		}
	},
	work : function(){
		return work;
	},
	shop : function(){
		return shop;
	},
	module : function(){
		return module;
	},
	origine : function(){
		return origine;
	},
	destins : function(){
		
		return Origins.find({
			matter : this.matter._id,
			_id : {
				$not : this.origin._id
			}
		}).fetch();
	},
	q : function(){

		var splited = Router.current().url.split("?")
		return splited.length>1 ? "?"+splited[1] : ""
	},
	pager : function(){
		var self = this;
		var max = 3;
		var result = [];
		var getQuery = function(key){
			var date = moment(self.date);
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
				originId : self.origin._id
			});
		}
		return result;
	}
});
function sendmatterOriginsTransfert(matter){
	console.log(matter);
	Meteor.call("moveCreator", {
						workId : null,
						quantity : matter.quantity,
						destinyId : matter.destiny,
						originId : matter.origin,
						dateTime : moment().toISOString()
					}, function(error, data){
						if(error) return Session.set("errorMessage", error.reason);
						Session.set("successMessage", data);
					});
	Session.set(Meteor.MATTER, false);
}

Template.originshow.events({
	"blur input[name='quantity']" : function(event){
		var matter = Session.get(Meteor.MATTER)||{};
		matter.quantity = event.target.value.toLowerCase();
		matter.origin = this.origin._id;
		Session.set(Meteor.MATTER, matter);
		if(matter.quantity && matter.destiny){
			sendmatterOriginsTransfert(matter);
			$("input[name='quantity'], select[name='destiny']").val("");	
		}else if(matter.destiny){
			Session.set(Meteor.MATTER, false);
			$("input[name='quantity'], select[name='destiny']").val("");
		}
	},
	"change select[name='destiny']" : function(event){
		var self = this;
		if(Meteor.isCordova && event.target.value == "barcode"){
			cordova.plugins.barcodeScanner.scan(
				function (result) {
					$(event.target)
					.find("option")
					.each(function(k, elem){
						if($(elem).html() == result.text){
							$(event.target).val($(elem).val());
							
							var matter = Session.get(Meteor.MATTER)||{};
							matter.destiny = $(elem).val();
							matter.origin = self.origin._id;
							Session.set(Meteor.MATTER, matter);
							if(matter.quantity && matter.destiny){
								sendmatterOriginsTransfert(matter);
								$("input[name='quantity'], select[name='destiny']").val("");
							}
						}
					});
				}, 
				function (error) {
					alert("Scanning failed: " + error);
				}
			);
		}else{
			var matter = Session.get(Meteor.MATTER)||{};
			matter.destiny = event.target.value;
			matter.origin = this.origin._id;
			Session.set(Meteor.MATTER, matter);
			if(matter.quantity && matter.destiny){
				sendmatterOriginsTransfert(matter);
				$("input[name='quantity'], select[name='destiny']").val("");
			}
		}		
	}
});
Template.originshow.destroyed = function(){
	Session.set(Meteor.MATTER, false);
};
Template.originshow.rendered = function(){
	Session.set(Meteor.MATTER, false);	
};

