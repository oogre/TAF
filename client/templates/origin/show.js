
var shop, module, origine, work;
Template.originshow.helpers({
	value : function(){
		console.log(this);
	},
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
						'modules.0.serial' : destinyId
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
	}
});
function sendmatterOriginsTransfert(matter){
	Meteor.call("matterOriginsTransfert", {
						workId : null,
						quantity : matter.quantity,
						destinyId : matter.destiny,
						originId : matter.origin,
						dateTime : moment().toISOString()
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

