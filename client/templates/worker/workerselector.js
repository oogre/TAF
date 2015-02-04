"use strict";
/*global $ : false */
/*global Workers : false */
/*global Template : false */


var initSelector = function(){
	$("#workers")
		.multiselect({
			buttonWidth: "100%", 
			includeSelectAllOption: true,
			allSelectedText: "Tout le monde",
			selectAllText : "Tout le monde",
			nonSelectedText : "Aucun Homme",
			onChange: function(option, checked) {
				if(checked){
					//$(".addWorkers").removeClass("hide");
				}
				else{
					//$(".addWorkers").addClass("hide");
				}
			}
		})
		.multiselect("dataprovider", Workers
									.find()
									.map(function(worker){
										if(worker.profile){
											return {
												label: worker.profile.firstname + " " + worker.profile.lastname, 
												value: worker._id
											};
										}
										else{
											return {
												label: "noName", 
												value: worker._id
											};
										}
									})
		);
};

Template.workerselector.rendered = function  () {
	initSelector();
};

Template.workerselector.helpers({
	setMultiselector : function(){
		initSelector();
	},
});