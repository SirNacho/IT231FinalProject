var express = require('express');
var router = express.Router();

function adminonly(req,res,next){
	if (!req.session.isadmin)
		{return res.render('customer/login', {message: "Restricted Area - Need Admin Privs"});}
    next();
}

router.get('/', adminonly, function(req, res, next) {
    let query = "SELECT review_id, customer_id, product_id, reviewdate, rating, status FROM review";

  // execute query
  db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('review/allrecords', {allrecs: result });
 	});
});

router.post('/submit', function(req, res, next){

    var prod_id = req.body.product_id;
    if (req.session.customer_id)
        {
            res.render('review/submit', {prod_id : prod_id, cust_id : req.session.customer_id});

        } else {
            res.render('customer/login', {message: "Please Login First"});
        }

});

router.get('/:recordid/show', adminonly, function(req, res, next) {
    let query = "SELECT review_id, customer_id, product_id, reviewdate, comments, rating, status FROM review WHERE review_id = " + req.params.recordid;
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('review/onerec', {onerec: result[0] });
        }
    });
});

router.get('/addrecord', adminonly, function(req, res, next) {
	res.render('review/addrec');
});

router.post('/', function(req, res, next) {

    let insertquery = "INSERT INTO review(customer_id, product_id, comments, reviewdate, rating, status) VALUES (?, ?, ?, now(), ?, 'Review')";

    db.query(insertquery,[req.body.customer_id, req.body.product_id, req.body.comments, req.body.rating],(err, result) => {
        if (err) {
                console.log(err);
                res.render('error');
            } else {
                res.redirect('/');
                }
    });
});

router.get('/:recordid/edit', adminonly, function(req, res, next) {
    let query = "SELECT review_id, customer_id, product_id, reviewdate, comments, rating, status FROM review WHERE review_id = " + req.params.recordid;

      // execute query
      db.query(query, (err, result) => {
            if (err) {
                console.log(err);
                res.render('error');
            } else {
                res.render('review/editrec', {onerec: result[0] });
            }
         });
});

router.post('/save', adminonly, function(req, res, next) {
	let updatequery = "UPDATE review SET customer_id = ?, product_id = ?, reviewdate = ?, comments = ?, rating = ?, status = ? WHERE review_id = " + req.body.review_id;

	db.query(updatequery,[req.body.customer_id, req.body.product_id, req.body.reviewdate, req.body.rating, req.body.status],(err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.redirect('/review');
		}
	});
});

router.get('/:recordid/delete', adminonly, function(req, res, next) {
    let query = "DELETE FROM review WHERE review_id = " + req.params.recordid;

      // execute query
      db.query(query, (err, result) => {
            if (err) {
                console.log(err);
                res.render('error');
            } else {
                res.redirect('/review');
            }
         });
    });

module.exports = router;