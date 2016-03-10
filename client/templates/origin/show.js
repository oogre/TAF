
var shop, module, origine;
Template.originshow.helpers({
	formatize : function(dateTime){
		return moment(dateTime).format("DD MMM YYYY");
	},
	setCurrent : function(destinyId){
		shop = Shops.findOne({
			'modules.0.serial' : destinyId
		});
		if(shop){
			module = _.find(shop.modules, function(item){
						return item.serial == destinyId;
					});
		}else{
			module = false;
			origine = Origins.findOne(destinyId);
		}
	},
	shop : function(){
		return shop;
	},
	module : function(){
		return module;
	},
	origine : function(){
		return origine;
	}
})