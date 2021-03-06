(function(){"use strict";
/*global _ : false */
/*global process : false */
/*global Meteor : false */
/*global Npm : false */

Meteor.pdfkit = function(param){
	var pgCounter = 1 ;
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
				file : process.env.PWD+Meteor.config.path+"/fonts/dejavu/DejaVuSans.ttf"
			},{
				name : "DejaVuSans-Bold",
				file : process.env.PWD+Meteor.config.path+"/fonts/dejavu/DejaVuSans-Bold.ttf"
			},{
				name : "DejaVuSansMono",
				file : process.env.PWD+Meteor.config.path+"/fonts/dejavu/DejaVuSansMono.ttf"
			},{
				name : "DejaVuSansMono-Bold",
				file : process.env.PWD+Meteor.config.path+"/fonts/dejavu/DejaVuSansMono-Bold.ttf"
			}]
	};
	param = _.extend(_param, param);

//	var PDFKit = Npm.require("pdfkit");//PDFDocument
	var doc = new PDFDocument({
		bufferPages: true,
		size : param.page.size
	});

	var flagOnePage = true;

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
	

	return {
		pgCounter : function(){
			return pgCounter;
		},
		doc : function(){
			return doc;
		},
		addPage : function(){
			doc.addPage();
			doc.page.margins = param.page.margins;

			if(flagOnePage){
				flagOnePage = false;
				doc.param.maxLinePerPage += 6;
			}
			pgCounter ++;
			return this;
		},
		end : function(next){
			var range = doc.bufferedPageRange();
			for (var p = range.start ; p < range.count ; p++){
				doc.switchToPage(p);
				doc.text(range.count, 63, 104);
			}
			doc.flushPages();

			var fs = Npm.require("fs");
			param.dest += "/"+ param.filename;
			param.dest = param.dest.replace("//", "/");
			var dirpath  = param.dest.split("/");
			dirpath.pop();
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

			doc.write(param.dest);
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
}).call(this);
