(function(){"use strict";
/*global _ : false */
/*global s : false */
/*global Npm : false */
/*global Works : false */
/*global Wikis : false */
/*global Shops : false */
/*global Meteor : false */
/*global moment : false */
/*global Workers : false */
/*global process : false */


// meteor run android-device --mobile-server http://ogre.local:3000

Meteor.methods({

	workToPdf : function(workId){
		this.unblock();

		var Future = Npm.require("fibers/future");
		var myFuture = new Future();
		
		var currentUser = Meteor.user();
		var work = Works.findOne(workId);
		if(!work){
			return false;
		}

		var shop = Shops.findOne(work.shop._id);
		if(!shop){
			return false;
		}
		var dest = process.env.PWD + "/.uploads/pdf/";
		var filename = shop.brand.replace(" ", "-") + "/" + moment().format("YYYY-MM-DD") + "-" + workId + ".pdf";

		var fs = Npm.require("fs");		
		if (fs.existsSync(dest+filename)) {
			return "/upload/pdf/"+filename;
		}

		var wikis = Wikis.find({
			_id : {
				$in : (work.wikis || [])
			}
		}).fetch();
		
		var pictures = Picts.find({
			_id : {
				$in : (work.pictures || [])
			}
		}).fetch();
		
		work.workers = Workers.find({
			_id : {
				$in : _.keys(work.schedular)
			}
		}).fetch();
		
		work.workers = work.workers.map(function(worker){
			worker.schedular = work.schedular[worker._id];
			return worker;
		});

		Meteor.pdfkitConfig.param.filename = filename; 
		Meteor.pdfkitConfig.param.dest = dest; 

		var pdf = new Meteor.pdfkit(Meteor.pdfkitConfig.param);

		pdf = Meteor.pdfkitConfig.templates(pdf);
		pdf
		.template("header", process.env.PWD+"/programs/web.browser/app/images/adf-logo.png")
		.template("footer", [{
			size : 1.75,
				text : [{
					align : "left",
					value : "<b>Atelier</b>\n\nrue des technologies 2ter\nB-4432 Alleur"
				}],
				border : false,
			},{
				size : 1.75,
				text : [{
					align : "left",
					value : "<b>Téléphone & Fax</b>\n\nFixe : 04 366.13.18\nFax : 04 239.20.89"
				}],
				border : false,
			},{
				size : 1.75,
				text : [{
					align : "left",
					value : "<b>Service Technique</b>\n\n1er : 0495.51.43.09\n2nd : 0495.48.68.96"
				}],
				border : false,
			},{
				size : 1.75,
				text : [{
					align : "left",
					value : "<b>Internet</b>\n\nMail : info@atelierdufroid.be\nSite : www.atelierdufroid.be"
				}],
				border : false,
			}
		])
		.template("title", [{
				size : 1,
				text : [{
					align : "center",
					value : "/",
					folio : true
				}]
			},{
				size : 4,
				text : [{
					align : "center",
					value : "Fiche de travail : " + work.type
				}]
			}, {
				size : 2,
				text : [{
					align : "center",
					value : work._id
				}]
			}
		])
		.template("row", {
			content : [{
				size :4, 
				text : [{ 
					align : "left",
					value : "Client : "
				},{
					align : "center",
					value : s(shop.name+" - "+shop.brand).titleize()
				}]
			},{
				size : 3,
				text : [{ 
					align : "left",
					value : "Date rapport : "
				},{
					align : "center",
					value : moment().format("DD/MM/YYYY")
				}]
			}]
		})
		.template("row", {
			content : [{
					size :4, 
					text : [{ 
						align : "left",
						value : "Adresse : "
					},{
						align : "center",
						value : s(shop.address.street+" "+shop.address.number+", " + shop.address.zipcode + " " + shop.address.city).titleize()
					}]
				},{
					size :3, 
					text : [{ 
						align : "left",
						value : "Heures déplacement : "
					},{
						align : "center",
						value : moment.duration(shop.timeDist, "seconds").humanize()
					}]
				}]
		})
		.template("row", {
			content : [{
					size :4, 
					text : [{ 
						align : "left",
						value : "Personne de contact : "
					},{
						align : "center",
						value : shop.contacts[0]
					}]
				}
			]
		})
		.template("row", {
			content : [{
					size :7, 
					text : [{
						align : "center",
						value : " "
					}],
					border : false
				}]
		})
		.template("row", {
			content : [{
					size :7, 
					text : [{
						align : "center",
						value : " "
					}],
					border : false
				}]
		})
		.template("row", {
			content : [{
					size :7, 
					text : [{
						align : "center",
						value : " "
					}],
					border : false
				}]
		})
		
		.template("newSection", {})
		.template("row", {
			content : [{
					size :7, 
					text : [{
						align : "center",
						value : "Heures prestées par technicien"
					}]
				}
			]
		})
		.template("row", {
			content : [{
					size :3, 
					text : [{
						align : "center",
						value : "<b>Nom technicien</b>"
					}]
				},{
					size :2, 
					text : [{
						align : "center",
						value : "<b>Heure arrivée</b>"
					}]
				},{
					size :2, 
					text : [{
						align : "center",
						value : "<b>Heure départ</b>"
					}]
				}
			]
		});
		
		var scheduleLineCpt = 0;
		work.workers && work.workers.map(function(worker){
			worker.schedular.map(function(schedule, k ){
				scheduleLineCpt++;
				pdf.template("row", {
					content : [{
						size :3, 
						text : [{
							align : "center",
							value : k === 0 ? s(worker.profile.firstname +" "+worker.profile.lastname).titleize().value() : " - "
						}]
					},{
						size : 2, 
						text : [{
							align : "center",
							value : moment(schedule.start).format("DD/MM HH:mm")
						}]
					},{
						size : 2, 
						text : [{
							align : "center",
							value : moment(schedule.stop).format("DD/MM HH:mm")
						}]
					}]
				});
			});
		});
		for( ; scheduleLineCpt < 7 ; scheduleLineCpt ++){
			pdf.template("row", {
				content : [{
					size :3, 
					text : [{
						align : "center",
						value : " "
					}]
				},{
					size : 2, 
					text : [{
						align : "center",
						value : " "
					}]
				},{
					size : 2, 
					text : [{
						align : "center",
						value : " "
					}]
				}]
			});
		}
		pdf
		.template("row", {
			content : [{
					size :7, 
					text : [{
						align : "center",
						value : " "
					}],
					border : false
				}]
		})
		.template("newSection", {})
		.template("row", {
			content : [{
					size : 7, 
					text : [{
						align : "center",
						value : "Matériaux"
					}]
				}
			]
		})
		.template("row", {
			content : [{
					size : 6, 
					text : [{
						bold : true,
						align : "center",
						value : "<b>Description</b>"
					}]
				},{
					size : 1, 
					text : [{
						align : "center",
						value : "<b>Quantité</b>"
					}]
				}
			]
		});

		var mattersLineCpt = 0;
		work.matters && work.matters.map(function(matter){
			mattersLineCpt ++;
			pdf.template("row", {
				content : [{
					size : 6, 
					text : [{
						align : "center",
						value : s(matter.name).titleize().value()
					}]
				},{
					size : 1, 
					text : [{
						align : "center",
						value : matter.quantity+" "+matter.unit
					}]
				}]
			});
		});
		for( ; mattersLineCpt < 7 ; mattersLineCpt ++){
			pdf.template("row", {
				content : [{
					size : 6, 
					text : [{
						align : "center",
						value : " "
					}]
				},{
					size : 1, 
					text : [{
						align : "center",
						value : " "
					}]
				}]
			});
		}


		pdf
		.template("row", {
			content : [{
					size :7, 
					text : [{
						align : "center",
						value : " "
					}],
					border : false
				}]
		})
		
		.template("newSection", {})
		.template("row", {
			content : [{
					size :7, 
					text : [{
						align : "center",
						value : "Travaux réalisées : constatation, cause, action prise, remarque"
					}]
				}
			]
		});


		var wikisLineCpt = 0;
		wikis.map(function(wiki){
			wikisLineCpt++;
			pdf
			.template("row", {
				content : [{
					size : 7, 
					text : [{
						align : "left",
						value : wiki.description
					}]
				}]
			});
		});
		for( ; wikisLineCpt < 8 ; wikisLineCpt ++){
			pdf
			.template("row", {
				content : [{
					size : 7, 
					text : [{
						align : "center",
						value : " "
					}]
				}]
			});
		}
/*
		var pictPerLine = 7 ; 
		var lines = pictures.length / pictPerLine;

		for(var y = 0 ; y < lines ; y ++){
			pdf
			.template("row", {
				content : [{
					align : "center",
					size : 1, 
					image : ( function(){
								var images = []
								for(var x = 0 ; x < pictPerLine ; x ++){
									var id = x+(y*pictPerLine);
									if(id >=pictures.length )return images;
									var src = pictures[id]
									images.push({
										src : _.isString(src) ? src : (process.env.PWD + "/.uploads/"+src.data.path)
									});
								}
								return images;

							})()
				}]
			})
		}*/

		pdf
		.template("row", {
			content : [{
					size :7, 
					text : [{
						align : "center",
						value : " "
					}],
					border : false
				}]
		})
		
		.template("newSection", {})
		.template("row", {
			content : [{
					size :7, 
					text : [{
						align : "center",
						value : "Signature pour accord heures, matériaux, outillage"
					}]
				}
			]
		}).template("row", {
			content : [{
					size :3, 
					text : [{
						align : "left",
						value : "Client : "
					},{
						align : "center",
						value : "Nom + Signature"
					}]
				},{
					size :2, 
					text : [{
						align : "center",
						value : "Atelier du froid"
					}]
				},{
					size :2, 
					text : [{
						align : "center",
						value : "Contrôle Management"
					}]
				}
			]
		})
		.template("row", {
			content : [{
				align : "center",
				size : 3, 
				image : [{
					src : process.env.PWD + "/.uploads/"+work.signatures.client.path
				}]
			},{
				align : "center",
				size : 2, 
				image : [{
					src : process.env.PWD + "/.uploads/"+work.signatures.adf.path
				}]
			},{
				align : "center",
				size : 2, 
				image : [{
					src : process.env.PWD+"/programs/web.browser/app/images/ADF-management.png"
				}]
			}]
		});

		pdf
		.end(function(file){
			Works.update({
				_id:workId
			}, {
				$set : {
					summary : file
				}
			})
			myFuture.return(file);
		});
		return myFuture.wait();
	}
});
}).call(this);

//# sourceMappingURL=methods.work.js.map