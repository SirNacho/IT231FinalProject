var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	let query = "SELECT product_id, productname, prodimage, description, prodcolor, package_id, category_id, saleprice, status FROM product";

  // execute query
  db.query(query, (err, result) => {
  if (err) {
          res.redirect('/');
      }
  res.render('catalog', {allrecs: result });
   });
});

router.post('/add', function(req, res, next) {
	if (typeof req.session.cart !== 'undefined' && req.session.cart ) {
		if (req.session.cart.includes(req.body.product_id))
			{
				// Item Exists in Basket - Increase Quantity
				var n = req.session.cart.indexOf(req.body.product_id);
				req.session.qty[n] = parseInt(req.session.qty[n]) + parseInt(req.body.qty);
			}
		else
			{
				// Item Being Added First Time
				req.session.cart.push(req.body.product_id);
				req.session.qty.push(req.body.qty);
			}
	}else {
		var cart = [];
		cart.push(req.body.product_id);
		req.session.cart = cart;

		var qty = [];
		qty.push(req.body.qty);
		req.session.qty = qty;
	}
  res.redirect('/catalog/cart');
});

router.get('/cart', function(req, res, next) {

	if (!Array.isArray(req.session.cart) || !req.session.cart.length){
		res.render('cart', {cartitems: 0 });
	} else {

 		let query = "SELECT product_id, productname, prodimage, description, prodcolor, package_id, category_id, saleprice, status FROM product WHERE product_id IN (" + req.session.cart + ") order by find_in_set(product_id, '" + req.session.cart + "');";

		// execute query
		db.query(query, (err, result) => {
			if (err) {res.render('error');} else
					{res.render('cart', {cartitems: result, qtys: req.session.qty  });}
		});
	}
});

router.post('/remove', function(req, res, next) {
var n = req.session.cart.indexOf(req.body.product_id);

req.session.cart.splice(n,1);
req.session.qty.splice(n,1);

   res.redirect('/catalog/cart');

});

router.get('/checkout', function(req, res, next) {
	var proditemprice = 0;
	if (typeof req.session.customer_id !== 'undefined' && req.session.customer_id ) {
		let insertquery = "INSERT INTO saleorder(customer_id, saledate, customernotes, paymentstatus, authorizationnum) VALUES (?, now(), 'None', 'Paid', '12345678')";
		db.query(insertquery,[req.session.customer_id],(err, result) => {
			if (err) {
				console.log(err);
				res.render('error');
			} else {
				var order_id = result.insertId;
				req.session.cart.forEach((cartitem, index) => {
					let insertquery = "INSERT INTO orderdetail(order_id, product_id, saleprice, qty) VALUES (?, ?, (SELECT saleprice from product where product_id = " + cartitem + "), ?)";
					db.query(insertquery,[order_id, cartitem, req.session.qty[index]],(err, result) => {
						if (err) {res.render('error');}
					});
				});
				req.session.cart = [];
				req.session.qty = [];
				res.render('checkout', {ordernum: order_id });
				}
			});
	}
	else {
		res.redirect('/customer/login');
	}
});



module.exports = router;
