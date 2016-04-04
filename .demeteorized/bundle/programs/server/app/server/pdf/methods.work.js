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
		else if(!shop.zone){
			shop.zone = Meteor.timeDistToZone(shop.timeDist);
			Shops.update(shop._id, {
				$set : {
					zone : shop.zone
				}
			});
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

		work.matters = work.matters || [];
		work.schedule = work.schedule || [];
		pictures = pictures || [];
		wikis = wikis || [];
		work.modules = work.modules || [];

		var workers = Workers
						.find({
							_id : { 
								$in : 	_
										.chain(work.schedule)
										.pluck("workerId" )
										.uniq()
										.value()
							}
						})
						.fetch()
						.map(function(worker){
							return {
								_id : worker._id,
								name : worker && worker.profile ? s(worker.profile.firstname +" "+worker.profile.lastname).titleize().value() : "/"
							}
						});

		work.schedule = _
						.chain(work.schedule)
						.map(function(item){
							item.timetable = !item.timetable || item.timetable.length == 0 ? [{start:""}] : item.timetable;
							return item.timetable.map(function(elem, k){
								var worker = _.find(workers, function(worker){
									return item.workerId == worker._id;
								});
								return {
									name : k === 0 && worker ? worker.name : " - ",
									start : elem && elem.start ? elem.start : null,
									stop : elem && elem.stop ? elem.stop : null,
								};
							})
						})
						.flatten()
						.value();

		var moduleTask = [];

		work.modules.map(function(module){
			module.tasks = module.tasks || [];
			module.tasks.map(function(task, k){
				moduleTask.push({
					id : k === 0 ? (module.serial+" : "+module.type+" - "+module.name) : " - ",
					task : task.name,
					value : _.isBoolean(task.checked) ? (task.checked ? "V" : " ") : task.checked
				});
			});
		});

/*
		for(var i = 0 ; i < 11; i ++){
			work.schedule.push(work.schedule[0]);
		}

		for(var i = 0 ; i < 11; i ++){
			work.matters.push(work.matters[0]);
		}

		var extraLineCounter = [
			work.schedule.length,
			work.matter.length,
			wikis.length
		];

		var addlineCpt = 3 * pdf.doc().param.minLinePerCat;
*/





		var dest = process.env.PWD + "/.uploads/pdf/";
		var filename = shop.brand.replace(" ", "-") + "/" + moment().format("YYYY-MM-DD") + "-" + workId + ".pdf";

		var fs = Npm.require("fs");		
		if (false && fs.existsSync(dest+filename)) {
			return "/upload/pdf/"+filename;
		}


		Meteor.pdfkitConfig.param.filename = filename; 
		Meteor.pdfkitConfig.param.dest = dest; 

		var pdf = new Meteor.pdfkit(Meteor.pdfkitConfig.param);

		pdf = Meteor.pdfkitConfig.templates(pdf);

		var header = function(){
			pdf
			.template("header", process.env.PWD+"/public/images/adf-logo.png") // /programs/web.browser/app/
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
						value : pdf.pgCounter()+" /",
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
						value : work.myId || work._id
					}]
				}
			]);
		};

		var timeHeader = function(){
			pdf
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
		};

		var matterHeader = function(){
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
		};

		var wikiHeader = function(){
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
		};


		var moduleHeader = function(){
			pdf
			.template("newSection", {})
			.template("row", {
				content : [{
						size :7, 
						text : [{
							align : "center",
							value : "Récapitulatif de l'entretien"
						}]
					}
				]
			}).template("row", {
				content : [{
						size :3, 
						text : [{
							align : "center",
							value : "<b>Identifiant</b>"
						}]
					},{
						size :3, 
						text : [{
							align : "center",
							value : "<b>Tâche</b>"
						}]
					},{
						size :1, 
						text : [{
							align : "center",
							value : "<b>Résultat</b>"
						}]
					}
				]
			});
		}

		header();

		pdf
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
						value : "Zone : "
					},{
						align : "center",
						value : shop.zone
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
		});

	/*


	START Heures prestées par technicien


	*/

		timeHeader();

		var lineCpt = 0 ;
		
		for(var scheduleLineCpt = 0 ; scheduleLineCpt < pdf.doc().param.minLinePerCat || scheduleLineCpt < work.schedule.length ; scheduleLineCpt ++){
			/*
			if(scheduleLineCpt >= Math.floor(addlineCpt/3)){
				addlineCpt--;
			}
			*/

			if(lineCpt >= pdf.doc().param.maxLinePerPage){
				pdf.addPage();
				lineCpt = 0 ;
				header();
				timeHeader();
			}

			var item = work.schedule[scheduleLineCpt] || {};
			

			pdf.template("row", {
				content : [{
					size :3, 
					text : [{
						align : "center",
						value : item.name || " "
					}]
				},{
					size : 2, 
					text : [{
						align : "center",
						value : item.start ? moment(item.start).format("DD/MM HH:mm") : " "
					}]
				},{
					size : 2, 
					text : [{
						align : "center",
						value : item.stop ? moment(item.stop).format("DD/MM HH:mm") : " "
					}]
				}]
			});

			lineCpt ++;
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
		});

		lineCpt += 3;
		if(lineCpt >= pdf.doc().param.maxLinePerPage){
			pdf.addPage();
			lineCpt = 0 ;
			header();
		}

		/*
		STOP Heures prestées par technicien
		START Matériaux
		*/

		matterHeader();

		for(var mattersLineCpt = 0 ; mattersLineCpt < pdf.doc().param.minLinePerCat || mattersLineCpt < work.matters.length ; mattersLineCpt ++){
			/*
			if(mattersLineCpt >= Math.floor(addlineCpt/3)){
				addlineCpt--;
			}
			*/
			if(lineCpt > 0 && lineCpt > pdf.doc().param.maxLinePerPage){
				pdf.addPage();
				lineCpt = 0 ;
				header();
				matterHeader();
			}
			var item = work.matters[mattersLineCpt] || {};
			
			pdf.template("row", {
				content : [{
					size : 6, 
					text : [{
						align : "center",
						value : item.name ? s(item.name).titleize().value() : " "
					}]
				},{
					size : 1, 
					text : [{
						align : "center",
						value : item.quantity ? item.quantity+" "+item.unit : " "
					}]
				}]
			});
			lineCpt++;
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

		lineCpt += 3;
		if(lineCpt >= pdf.doc().param.maxLinePerPage){
			pdf.addPage();
			lineCpt = 0 ;
			header();
		}

		wikiHeader();

		for(var wikisLineCpt = 0 ; wikisLineCpt < pdf.doc().param.minLinePerCat || wikisLineCpt < wikis.length ; wikisLineCpt ++){
			/*
			if(wikisLineCpt >= Math.floor(addlineCpt/3)){
				addlineCpt--;
			}
			*/

			if(lineCpt > pdf.doc().param.maxLinePerPage){
				pdf.addPage();
				lineCpt = 0 ;
				header();
				wikiHeader();
			}
			var item = wikis[wikisLineCpt] || {};

			pdf
			.template("row", {
				content : [{
					size : 7, 
					text : [{
						align : "center",
						value : item.description ? item.description : " "
					}]
				}]
			});
			lineCpt++;
		};

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
		});

		lineCpt += 11;
		if(lineCpt >= pdf.doc().param.maxLinePerPage){
			pdf.addPage();
			lineCpt = 0 ;
			header();
		}

		pdf
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
						value : "Client :"
					},{
						align : "center",
						value : "<b>Nom + Signature</b>"
					}]
				},{
					size :2, 
					text : [{
						align : "center",
						value : "<b>Atelier du froid</b>"
					}]
				},{
					size :2, 
					text : [{
						align : "center",
						value : "<b>Contrôle Management</b>"
					}]
				}
			]
		});
		var clientSig = process.env.PWD;
		if(work.signatures && work.signatures.client && work.signatures.client.path && fs.existsSync(process.env.PWD + "/.uploads/"+work.signatures.client.path)) {
			clientSig += "/.uploads/"+work.signatures.client.path;
		}else{
			clientSig += "/public/images/ADF-management.png";
		}
		
		var adfSig = process.env.PWD;
		if(work.signatures && work.signatures.adf && work.signatures.adf.path && fs.existsSync(process.env.PWD + "/.uploads/"+work.signatures.adf.path)) {
			adfSig += "/.uploads/"+work.signatures.adf.path;
		}else{
			adfSig += "/public/images/ADF-management.png";
		}

		pdf
		.template("row", {
			content : [{
				align : "center",
				size : 3, 
				image : [{
					src : clientSig
				}]
			},{
				align : "center",
				size : 2, 
				image : [{
					src : adfSig
				}]
			},{
				align : "center",
				size : 2, 
				image : [{
					src : process.env.PWD+"/public/images/ADF-management.png" // /programs/web.browser/app/
				}]
			}]
		});

		if(work.type == "maintenance"){
			pdf.addPage();
			lineCpt = 0 ;
			header();
			
			moduleHeader();

			for(var moduleTaskLineCpt = 0 ; moduleTaskLineCpt < pdf.doc().param.minLinePerCat || moduleTaskLineCpt < moduleTask.length ; moduleTaskLineCpt ++){
				if(lineCpt >= pdf.doc().param.maxLinePerPage){
					pdf.addPage();
					lineCpt = 0 ;
					header();
					moduleHeader();
				}
				var item = moduleTask[moduleTaskLineCpt] || {};
				pdf.template("row", {
					content : [{
						size : 3, 
						text : [{
							align : "center",
							value : item.id || " "
						}]
					},{
						size : 3, 
						text : [{
							align : "center",
							value : item.task || " "
						}]
					},{
						size : 1, 
						text : [{
							align : "center",
							value : item.value || " "
						}]
					}]
				});
				lineCpt ++;
			}
		}

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
