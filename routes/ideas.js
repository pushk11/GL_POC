"use strict"
var mysql = require('node-mysql/node_modules/mysql');
var path = require('path');
var express = require('express');
var fse = require('fs-extra');

//var app = express();
////////////// For MySQL ///////////
/*var db = () => {
	return mysql.createConnection({
	   host     : 'localhost',
	   user     : 'root',
	   password : '',
	   database : 'memo'
	 });
};*/
///////////////////////////////////

/////// Mongo DB ////// can be put in config file
var Mongo = require("mongodb");
var MongoDB = {   
				Client: Mongo.MongoClient,
				Url: 'mongodb://localhost:27017/ideas',
				ObjectID: Mongo.ObjectID,
				Table: 'ideas'
			 }; 

//// ////////

var Ideas = {
	result: {status: 'failed', data: [], msg: ""},
	uploadPath: path.join(__dirname, '../public/uploads/'),

	getList: function(req, res) {

		    console.log(req.query.sortBy);

		    let sortBy = {created_date : -1};
		    let qtrSortBy = (req.query.sortBy) ? req.query.sortBy.trim() : '';
		    if ('' != qtrSortBy) {
		    	switch(qtrSortBy) {
		    		case 'title':
		    		 sortBy = {title : 1};
		    		 break;
		    		case 'date_asc':
		    		 sortBy = {created_date : 1};
		    		 break;
		    	}
		    }

            MongoDB.Client.connect(MongoDB.Url, (err, db) => {

           	db.collection(MongoDB.Table).find({}).sort(sortBy).toArray( (err, items) => {
           	   	 	if (!err) {
           	   			let result = Object.assign({}, Ideas.result, {status: 'ok', data: items, msg: "Success - Listing Data"});
		 	 			res.json(result);
		 	 		} else {
		 	 			res.json({error: "Error in getting data", desc: err});
		 	 		}
           	   });
           });

		    /* //// Using MySQL ////

		    let sortBy = ' ORDER BY created_date DESC';
		    let qtrSortBy = (req.query.sortBy) ? req.query.sortBy.trim() : '';
		    if ('' != qtrSortBy) {
		    	switch(qtrSortBy) {
		    		case 'title':
		    		 sortBy = ' ORDER BY title';
		    		 break;
		    		case 'date_asc':
		    		 sortBy = ' ORDER BY created_date ASC';
		    		 break;
		    	}
		    }

		   let con = db();	
	 	   con.query('SELECT id, title, body, created_date FROM idea ' + sortBy, function(err, rows) {
		   if (!err) {
		     let len = rows.length;
		     let rowsData = [];
		     for(let i=0; i<len; i++) {
		     	rowsData.push(rows[i]);
		     }

		     let result = Object.assign({}, this.result, {status: 'ok', data: rowsData, msg: "Success - Listing Data"});

		 	 res.json(result);

		 	} else {
		 	 res.json({error: "Error in getting data", desc: err});
		     console.log('Error while performing Query.');
		   }

		 });*/
	},
	addIt: function(req, res) {

		MongoDB.Client.connect(MongoDB.Url, (err, db) => {

       	db.collection(MongoDB.Table).insert({title: '', body: '', created_date: new Date()}, (err, items) => {
       	   	 	if (!err) {
       	   	 		console.log(items);
       	   			let result = Object.assign({}, Ideas.result, {status: 'ok', data: {"insertId": items.insertedIds[0]}, msg: "Success - Listing Data"});
	 	 			res.json(result);
	 	 		} else {
	 	 			res.json({error: "Error in getting data", desc: err});
	 	 		}
       	   });
       });

		/* ///// MysQL Code ////

		let con = db();	
		con.query('INSERT into idea(title)VALUES(?)', [''], function(checkError, rows, fields) {
			if (!checkError ) {
				//res.json({'status' : 'ok'});
				let result = Object.assign({}, Ideas.result, {status: 'ok', data: rows, msg: "Success - Added Data"});
	 	 		res.json(result);
				con.end();
			} else {
				//res.json({'status' : 'failed'});
				let result = Object.assign({}, Ideas.result, {msg: "Failed - Not Added"});
	 	 		res.json(result);
				con.end();
			}
		});*/
	},
	updateIt: function(req, res) {
		try {
                var multiparty = require("multiparty");
				var form = new multiparty.Form();

			    form.parse(req, (err, fields, files) => {

				   	//////////////////////////////////////////
				   	
					//var input = req.body;
					var id = fields.id[0];
					var title = fields.title[0];
					var body = fields.body[0];

					if ( (!id || !title) || (id && id.trim() == '') || (title && title.trim() == '') ) {
						let result = Object.assign({}, Ideas.result, { msg: "Failed - Invalid data - provide Title/Body/ID required data"});
				 	 	res.json(result);
						return;
					}

					MongoDB.Client.connect(MongoDB.Url, (err, db) => {

 						let data = { title: title, body : body, created_date: new Date() };

 						db.collection(MongoDB.Table).update({_id: MongoDB.ObjectID(id)}, data, (err, ret) => {
 							if (!err) {
			       	   	 		Ideas.getList(req, res);
				 	 		} else {
				 	 			let result = Object.assign({}, Ideas.result, {msg: "Failed - Not Updated"});
				 	 			res.json(result);
				 	 		}
			 			});
 					});


					///////////////////// MySQL code //////
					//let data = { title: title, body : body};
					//let where = {id: id};
					//var con = db();
					//con.query('UPDATE idea SET ? WHERE ? ', [data, where], function(checkError, rows, fields) {
					//	if (!checkError ) {

							/*if (typeof files.myFile !== 'undefined' && files.myFile[0]) {
							  var extArr = files.myFile[0].originalFilename.split('.');
							  var newPath =  Ideas.uploadPath + id+ "."+extArr[extArr.length-1];

							  try {
							  	console.log("Uploading......"+ files.myFile[0].path + " .. to "+ newPath);
							    fse.copySync(files.myFile[0].path, newPath);
							  } catch(e) {
							  	console.error("error in file upload");
							  } 
					        }*/
							//res.json({'status' : 'ok'});
					/*		Ideas.getList(req, res);
							con.end();
						} else {
							//res.json({'status' : 'failed'});
							let result = Object.assign({}, Ideas.result, {msg: "Failed - Not Updated"});
				 	 		res.json(result);
							con.end();
						}
					});*/
					/////////////////////////////////////////
					 
				});

			
		} catch(e) {
			let result = Object.assign({}, Ideas.result, { msg: "Failed- Invalid Form Data"});
		 	res.json(result);
		}
	},
	deleteIt: function(req, res) {
		
		var input = req.params;
		var id = input.id;
		console.log(id);

		if (!id) {
			let result = Object.assign({}, Ideas.result, {msg: "Delete failed - Invalid ID"});
		 	res.json(result);
		} else {

			MongoDB.Client.connect(MongoDB.Url, (err, db) => {

				db.collection(MongoDB.Table).remove({_id: MongoDB.ObjectID(id)}, (err, ret) => {
					if (!err) {
	       	   	 		Ideas.getList(req, res);
		 	 		} else {
		 	 			let result = Object.assign({}, Ideas.result, {msg: "Failed - Not Updated"});
		 	 			res.json(result);
		 	 		}
	 			});
			});


			/*
				////// MysqL code////

			let con = db();	
			con.query('DELETE FROM idea WHERE id IN (?) ', [id], function(checkError, result) {
				if (!checkError && (result.affectedRows > 0) ) {
					Ideas.getList(req, res);
			*/
					// delete file
					/*try{
					 fse.removeSync(Ideas.uploadPath+id+".*");
				    } catch(e) {
				    	console.log("The file could not be removed");
				    }*/

					//res.json({'status' : 'ok'});
			/*		con.end();
				} else {
					//res.json({'status' : 'failed'});
					con.end();
				}
			});*/
		}
	}


};

module.exports = Ideas;