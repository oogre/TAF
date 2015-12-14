"use strict";
/*global _ : false */
/*global process : false */
/*global Meteor : false */
/*global Npm : false */

Meteor.pdfkit = function(param){
	var _param = {
		dest : process.env.PWD + "/.uploads/pdf/",
		filename : "default.pdf",
		page : {
			size : "A4",
			margins : {
				left : 15,
				top : 15,
				right : 15,
				bottom : 15
			},
			colomn : 7
		},
		line : {
			height : 9,
			padding : 2,
			margin : 5
		},
		stroke : {
			bold : 2,
			thin : 0.2
		},
		fill : {
			grey : "#dedede",
			black : "#000000"
		},
		fonts : [{
				name : "DejaVuSans",
				file : process.env.PWD + "/public/fonts/dejavu/DejaVuSans.ttf"
			},{
				name : "DejaVuSans-Bold",
				file : process.env.PWD + "/public/fonts/dejavu/DejaVuSans-Bold.ttf"
			},{
				name : "DejaVuSansMono",
				file : process.env.PWD + "/public/fonts/dejavu/DejaVuSansMono.ttf"
			},{
				name : "DejaVuSansMono-Bold",
				file : process.env.PWD + "/public/fonts/dejavu/DejaVuSansMono-Bold.ttf"
			}]
	};
	param = _.extend(_param, param);

	//var PDFKit = Npm.require("pdfkit");//PDFDocument
	var doc = new PDFDocument({
		bufferPages: true,
		size : param.page.size
	});

	//doc.pipe(fs.createWriteStream(param.dest));

	param.fonts.map(function(font){
		doc.font(font.file, font.name);
	});
	doc.page.margins = param.page.margins;

	var _templates = {};

	doc.param = param;

	doc.oogre = {
		position : [0, 0],
		usedWidth : doc.page.width - doc.page.margins.left - doc.page.margins.right,
		colWidth : (doc.page.width - doc.page.margins.left - doc.page.margins.right) / param.page.colomn,
		setGet : function(name, data, position){
			if(!this[name]){
				this[name] = {
					data : data,
					position : position
				};
			}
			return this[name];
		},
		footer : false
	};

	/*
		var maxDocY = doc.page.height - doc.page.margins.bottom;
		var _dataTitle = false;
		var _dataFooter = false;
		var _dataHeader = false;
		var _dataFolio = false;
	*/
	
	return {
		doc : function(){
			return doc;
		},
		end : function(next){
			var fs = Npm.require("fs");
			var dirpath  = param.dest.split("/");
			var path = "";
			var checkDir = fs.statSync(process.env.PWD);
			
			dirpath.map(function(elem){
				path += "/"+elem; 
				if (!fs.existsSync(path)) {
					try{
						console.log(path);
						fs.mkdirSync(path, checkDir.mode, true);
					}catch(e){
						console.log("ERROR");
						if(e.code == "EEXIST");
					}
				}
			});

			path += "/"+ param.filename;

			console.log(path);
			
			doc.writeSync(param.dest);
			var url = "/upload/pdf/"+param.filename;
			return _.isFunction(next) ? next(url) : url;
		},
		getUrl : function(){
			return param.dest;
		},
		template : function(){
			var name;
			if(arguments.length === 0){
				return _templates;
			}
			else if(arguments.length == 1){
				name = arguments[0];
				if(_.isString(name)){
					return _templates[name];
				}
			}
			else if(arguments.length == 2){
				if(_.isString(arguments[0])){
					name = arguments[0];
					if(_.isFunction(arguments[1])){
						var template = arguments[1];
						_templates[name] = template;
						return this;
					}
					else if(_.isFunction(_templates[name])){
						var fnc = _templates[name];
						var data = arguments[1];
						fnc(doc, data);
						return this;
					}
				}
			}
		}
	};
};