var express = require('express');
var router = express.Router();

function adminonly(req,res,next){
	if (!req.session.isadmin)
		{return res.render('customer/login', {message: "Restricted Area - Need Admin Privs"});}
    next();
}

router.get('/', adminonly, function(req, res, next) {
    let query = "SELECT orderdetail_id, order_id, product_id, saleprice, qty FROM orderdetail";
  db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('orderdetail/allrecords', {allrecs: result });
 	});
});

router.get('/:recordid/show', adminonly, function(req, res, next) {
    let query = "SELECT orderdetail_id, order_id, product_id, saleprice, qty FROM orderdetail WHERE orderdetail_id = " + req.params.recordid;

    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('orderdetail/onerec', {onerec: result[0] });
        }
    });
});

router.get('/addrecord', adminonly, function(req, res, next) {
	res.render('orderdetail/addrec');
});

router.post('/', function(req, res, next) {

    let insertquery = "INSERT INTO orderdetail(order_id, product_id, saleprice, qty) VALUES (?, ?, ?, ?)";

    db.query(insertquery,[req.body.order_id, req.body.product_id, req.body.saleprice, req.body.qty],(err, result) => {
        if (err) {
                console.log(err);
                res.render('error');
            } else {
                res.redirect('/orderdetail');
                }
    });
});

router.get('/:recordid/edit', adminonly, function(req, res, next) {
    let query = "SELECT orderdetail_id, order_id, product_id, saleprice, qty FROM orderdetail WHERE orderdetail_id = " + req.params.recordid;

      // execute query
      db.query(query, (err, result) => {
            if (err) {
                console.log(err);
                res.render('error');
            } else {
                res.render('orderdetail/editrec', {onerec: result[0] });
            }
         });
});

router.post('/save', adminonly, function(req, res, next) {
	let updatequery = "UPDATE orderdetail SET order_id = ?, product_id = ?, saleprice = ?, qty = ? WHERE orderdetail_id = " + req.body.orderdetail_id;

	db.query(updatequery,[req.body.order_id, req.body.product_id, req.body.saleprice, req.body.qty],(err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.redirect('/orderdetail');
		}
	});
});

router.get('/:recordid/delete',adminonly, function(req, res, next) {
    let query = "DELETE FROM orderdetail WHERE orderdetail_id = " + req.params.recordid;

      // execute query
      db.query(query, (err, result) => {
            if (err) {
                console.log(err);
                res.render('error');
            } else {
                res.redirect('/orderdetail');
            }
         });
    });


module.exports = router;