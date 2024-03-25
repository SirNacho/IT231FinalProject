var express = require('express');
var router = express.Router();

function adminonly(req,res,next){
	if (!req.session.isadmin)
		{return res.render('customer/login', {message: "Restricted Area - Need Admin Privs"});}
    next();
}

router.get('/', adminonly, function(req, res, next) {
let query = "SELECT order_id, customer_id, saledate, paymentstatus FROM saleorder";

  // execute query
  db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('saleorder/allrecords', {allrecs: result });
 	});
});

router.get('/:recordid/show', adminonly, function(req, res, next) {
    let query = "SELECT order_id, customer_id, saledate, customernotes, paymentstatus,   authorizationnum FROM saleorder WHERE order_id = " + req.params.recordid;

    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('saleorder/onerec', {onerec: result[0] });
        }
    });
});

router.get('/addrecord', adminonly, function(req, res, next) {
	res.render('saleorder/addrec');
});

router.post('/', function(req, res, next) {

    let insertquery = "INSERT INTO saleorder (customer_id, saledate, customernotes, paymentstatus, authorizationnum) VALUES (?, ?, ?, ?, ?)";

    db.query(insertquery,[req.body.customer_id, req.body.saledate, req.body.customernotes, req.body.paymentstatus, req.body.authorizationnum],(err, result) => {
        if (err) {
                console.log(err);
                res.render('error');
             } else {
                res.redirect('/saleorder');
            }
        });
    });

router.get('/:recordid/edit', adminonly, function(req, res, next) {
    let query = "SELECT order_id, customer_id, saledate, customernotes, paymentstatus, authorizationnum FROM saleorder WHERE order_id = " + req.params.recordid;

      // execute query
      db.query(query, (err, result) => {
            if (err) {
                console.log(err);
                res.render('error');
            } else {
                res.render('saleorder/editrec', {onerec: result[0] });
            }
         });
    });

router.post('/save', adminonly, function(req, res, next) {
	let updatequery = "UPDATE saleorder SET customer_id = ?, saledate = ?, customernotes = ?, paymentstatus = ?, authorizationnum = ? WHERE order_id = " + req.body.order_id;

	db.query(updatequery,[req.body.customer_id, req.body.saledate, req.body.customernotes, req.body.paymentstatus, req.body.authorizationnum],(err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.redirect('/saleorder');
		}
		});
});

router.get('/:recordid/delete', adminonly, function(req, res, next) {
    let query = "DELETE FROM saleorder WHERE order_id = " + req.params.recordid;
      db.query(query, (err, result) => {
            if (err) {
                console.log(err);
                res.render('error');
            } else {
                res.redirect('/saleorder');
            }
         });
    });



module.exports = router;

