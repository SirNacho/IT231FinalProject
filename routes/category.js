var express = require('express');
var router = express.Router();

function adminonly(req,res,next){
	if (!req.session.isadmin)
		{return res.render('customer/login', {message: "Restricted Area - Need Admin Privs"});}
    next();
}

router.get('/', adminonly, function(req, res, next) {
    let query = "SELECT category_id, categoryname FROM category";

  db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('category/allrecords', {allrecs: result });
 	});
});

router.get('/:recordid/show', adminonly, function(req, res, next) {
    let query = "SELECT category_id, categoryname, description FROM category WHERE category_id = " + req.params.recordid;

    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('category/onerec', {onerec: result[0] });
        }
    });
});

router.get('/addrecord', adminonly, function(req, res, next) {
	res.render('category/addrec');
});

router.post('/', function(req, res, next) {

     let insertquery = "INSERT INTO category (categoryname, description) VALUES (?, ?)";

    db.query(insertquery,[req.body.categoryname, req.body.description],(err, result) => {
        if (err) {
                console.log(err);
                res.render('error');
        } else {
                res.redirect('/category');
        }
    });
});

router.get('/:recordid/edit', adminonly, function(req, res, next) {
    let query = "SELECT category_id, categoryname, description FROM category WHERE category_id = " + req.params.recordid;

      // execute query
      db.query(query, (err, result) => {
            if (err) {
                console.log(err);
                res.render('error');
            } else {
                res.render('category/editrec', {onerec: result[0] });
            }
         });
    });

router.post('/save', adminonly, function(req, res, next) {

	let updatequery = "UPDATE category SET categoryname = ?, description = ? WHERE category_id = " + req.body.category_id;

	db.query(updatequery,[req.body.categoryname, req.body.description],(err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.redirect('/category');
		}
		});
});

router.get('/:recordid/delete', adminonly, function(req, res, next) {
    let query = "DELETE FROM category WHERE category_id = " + req.params.recordid;

      // execute query
      db.query(query, (err, result) => {
            if (err) {
                console.log(err);
                res.render('error');
            } else {
                res.redirect('/category');
            }
         });
    });


module.exports = router;

