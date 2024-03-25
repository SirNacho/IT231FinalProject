var express = require('express');
var router = express.Router();

function adminonly(req,res,next){
	if (!req.session.isadmin)
		{return res.render('customer/login', {message: "Restricted Area - Need Admin Privs"});}
    next();
}

router.get('/', adminonly, function(req, res, next) {
let query = "SELECT promotion_id, promotitle, promoimage, startdate, enddate FROM promotion";

  // execute query
  db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('promotion/allrecords', {allrecs: result });
 	});
});

router.get('/:recordid/show', adminonly, function(req, res, next) {
	let query = "SELECT promotion_id, promotitle, promoimage, description,  startdate, enddate, discountrate FROM promotion WHERE promotion_id = " + req.params.recordid;

	// execute query
	db.query(query, (err, result) => {
	if (err) {
		console.log(err);
		res.render('error');
	} else {
		res.render('promotion/onerec', {onerec: result[0] });
	}
	});
});

router.get('/addrecord', adminonly, function(req, res, next) {
	res.render('promotion/addrec');
});

router.post('/', function(req, res, next) {

	let insertquery = "INSERT INTO promotion (promotitle, promoimage, description,  startdate, enddate, discountrate) VALUES (?, ?, ?, ?, ?, ?)";

	db.query(insertquery,[req.body.promotitle, req.body.promoimage, req.body.description, req.body.startdate, req.body.enddate, req.body.discountrate],(err, result) => {
		if (err) {
				console.log(err);
				res.render('error');
		} else {
				res.redirect('/promotion');
				}
			});
	});

router.get('/:recordid/edit', adminonly, function(req, res, next) {
	let query = "SELECT promotion_id, promotitle, promoimage, description,  startdate, enddate, discountrate FROM promotion WHERE promotion_id = " + req.params.recordid;

	  // execute query
	  db.query(query, (err, result) => {
			if (err) {
				console.log(err);
				res.render('error');
			} else {
				res.render('promotion/editrec', {onerec: result[0] });
			}
		 });
	});

router.post('/save', adminonly, function(req, res, next) {
	let updatequery = "UPDATE promotion SET promotitle = ?, promoimage = ?, description = ?,  startdate = ?, enddate = ?, discountrate = ? WHERE promotion_id = " + req.body.promotion_id;

	db.query(updatequery,[req.body.promotitle, req.body.promoimage, req.body.description, req.body.startdate, req.body.enddate, req.body.discountrate],(err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.redirect('/promotion');
		}
		});
});

router.get('/:recordid/delete',adminonly, function(req, res, next) {
	let query = "DELETE FROM promotion WHERE promotion_id = " + req.params.recordid;

	  // execute query
	  db.query(query, (err, result) => {
			if (err) {
				console.log(err);
				res.render('error');
			} else {
				res.redirect('/promotion');
			}
		 });
	});

module.exports = router;