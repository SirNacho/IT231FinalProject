var express = require('express');
var router = express.Router();

function adminonly(req,res,next){
	if (!req.session.isadmin)
		{return res.render('customer/login', {message: "Restricted Area - Need Admin Privs"});}
    next();
}

router.get('/', adminonly, function(req, res, next) {
    let query = "SELECT subscription_id, customer_id, category_id, subscribedate, unsubscribedate FROM subscription";

  // execute query
  db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('subscription/allrecords', {allrecs: result });
 	});
});

router.get('/:recordid/show', adminonly, function(req, res, next) {
    let query = "SELECT subscription_id, customer_id, category_id,subscribedate, unsubscribedate FROM subscription WHERE subscription_id = " + req.params.recordid;

    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('subscription/onerec', {onerec: result[0] });
        }
    });
});

router.get('/addrecord', adminonly, function(req, res, next) {
	res.render('subscription/addrec');
});

router.post('/', adminonly, function(req, res, next) {

    let insertquery = "INSERT INTO subscription(customer_id, category_id, subscribedate, unsubscribedate) VALUES (?, ?, ?, ?)";

    db.query(insertquery,[req.body.customer_id, req.body.category_id, req.body.subscribedate, req.body.unsubscribedate],(err, result) => {
        if (err) {
                console.log(err);
                res.render('error');
            } else {
                res.redirect('/subscription');
                }
    });
});

router.get('/:recordid/edit', adminonly, function(req, res, next) {
    let query = "SELECT subscription_id, customer_id, category_id, subscribedate, unsubscribedate FROM subscription WHERE subscription_id = " + req.params.recordid;

      // execute query
      db.query(query, (err, result) => {
            if (err) {
                console.log(err);
                res.render('error');
            } else {
                res.render('subscription/editrec', {onerec: result[0] });
            }
         });
});

router.post('/save', adminonly, function(req, res, next) {
	let updatequery = "UPDATE subscription SET customer_id = ?, category_id = ?, subscribedate = ?, unsubscribedate = ? WHERE subscription_id = " + req.body.subscription_id;

	db.query(updatequery,[req.body.customer_id, req.body.category_id, req.body.subscribedate, req.body.unsubscribedate],(err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.redirect('/subscription');
		}
	});
});

router.get('/:recordid/delete', adminonly, function(req, res, next) {
    let query = "DELETE FROM subscription WHERE subscription_id = " + req.params.recordid;

      // execute query
      db.query(query, (err, result) => {
            if (err) {
                console.log(err);
                res.render('error');
            } else {
                res.redirect('/subscription');
            }
         });
    });




module.exports = router;