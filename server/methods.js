"use strict";
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


Meteor.methods({
	getServerIp : function(){
		var Future = Npm.require("fibers/future");
		var myFuture = new Future();
		var exec = Npm.require("child_process").exec;
		exec("ifconfig", function (error, stdout) {
			try{
				stdout = stdout.split("en1").pop();
				stdout = stdout.split("en2").shift();
				stdout = stdout.split("inet ").pop();
				myFuture.return(stdout.split(" netmask").shift());
			}catch(e){
				myFuture.return("");
			}
		});
		return myFuture.wait();
	},
	workToPdf : function(workId){

		var work = Works.findOne(workId);
		if(!work){
			return false;
		}
		var wikis = Wikis.find({
			_id : {
				$in : work.wiki_id
			}
		});
		
		var shop = Shops.findOne(work.shop._id);
		if(!shop){
			return false;
		}
		work.workers = Workers.find({
			_id : {
				$in : _.keys(work.schedular)
			}
		});
		

		work.workers = work.workers.map(function(worker){
			worker.schedular = work.schedular[worker._id];
			return worker;
		});

		this.unblock();
		var pdf = new Meteor.pdfkit(Meteor.pdfkitConfig.param);
		pdf = Meteor.pdfkitConfig.templates(pdf);
		pdf
		.template("header", process.env.PWD+"/public/images/adf-logo.png")
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
				}
			]
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
					size :4, 
					text : [{ 
						align : "left",
						value : "Nom technicien : "
					},{
						align : "center",
						value : work.workers[0] ? s(work.workers[0].firstname + " " + work.workers[0].lastname).titleize() : " - "
					}]
				}
			]
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
						value : "Nom technicien"
					}]
				},{
					size :1, 
					text : [{
						align : "center",
						value : "Heure arrivée"
					}]
				},{
					size :1, 
					text : [{
						align : "center",
						value : "Heure départ"
					}]
				},{
					size :1, 
					text : [{
						align : "center",
						value : "Temps déplac."
					}]
				},{
					size :1, 
					text : [{
						align : "center",
						value : "Heure prest."
					}]
				}
			]
		});

		work.workers.map(function(worker){
			worker.schedular.map(function(schedule, k ){
				pdf.template("row", {
					content : [{
						size :3, 
						text : [{
							align : "center",
							value : k === 0 ? s(worker.firstname +" "+worker.lastname).titleize().value() : " - "
						}]
					},{
						size : 1, 
						text : [{
							align : "center",
							value : moment(schedule.start).format("HH:mm")
						}]
					},{
						size : 1, 
						text : [{
							align : "center",
							value : moment(schedule.stop).format("HH:mm")
						}]
					},{
						size : 1, 
						text : [{
							align : "center",
							value : " - "
						}]
					},{
						size : 1, 
						text : [{
							align : "center",
							value : function(){
								var duration =	moment.duration();
								duration.add(moment(schedule.stop).subtract(moment(schedule.start)));
								return s.pad(Math.floor(duration.asHours()), 2, "0")+":"+s.pad(duration.minutes(), 2, "0");					
							}()
						}]
					}]
				});
			});
		});
		pdf
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
						align : "center",
						value : "Description"
					}]
				},{
					size : 1, 
					text : [{
						align : "center",
						value : "Quantité"
					}]
				}
			]
		});
		work.moduleMatters.map(function(module){
			module.matters.map(function(matter){
				pdf.template("row", {
					content : [{
						size : 6, 
						text : [{
							align : "center",
							value : s(module.serial +" - "+module.type+" - "+module.name+" : "+matter.name).titleize().value()
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
		});
		pdf
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
		wikis.map(function(wiki){
			pdf
			.template("row", {
				content : [{
					size : 7, 
					text : [{
						align : "center",
						value : wiki.description
					}]
					.concat(wiki.uploads.map(function(upload){
						return {
							align : "center",
							value : {
								src : _.isString(upload) ? upload : ("/upload/"+upload.path),
								param : {
									fit : [100, 100]
								}
							}
						};
					}))
				}]
			});
		});
		pdf
		.end(function(){
			console.log("finish");
		});
		return false;
	}
});