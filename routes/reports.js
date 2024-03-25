var express = require('express');
var router = express.Router();

function adminonly(req,res,next){
	if (!req.session.isadmin)
		{return res.render('customer/login', {message: "Restricted Area - Need Admin Privs"});}
    next();
}

router.get('/', adminonly, function(req, res, next) {
  res.render('reports/reportsmenu');
});

router.get('/customerreports', adminonly, function(req, res, next) {
  let query = "SELECT customer_id, firstname, lastname, email, phone, address1, address2, city, state, zip, username, password from customer";
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.render("error");
    }
    res.render('reports/customerreports', {customerrecs: result});
  });
});

router.get('/productreports', adminonly, function(req, res, next) {
  let query = "SELECT product_id, productname, prodimage, description, ingredients, weightdetail, healthwarn, prodcolor, package_id, category_id, saleprice, status, homepage from product";
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.render("error");
    }
    res.render('reports/productreports', {productrecs: result});
  });
});

router.get('/salesreports', adminonly, function(req, res, next) {
  let query = "SELECT order_id, customer_id, saledate, customernotes, paymentstatus, authorizationnum from saleorder";
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.render("error");
    }
    res.render('reports/salesreports', {salesrec: result});
  });
});

module.exports = router;