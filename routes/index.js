var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  let productQuery = "SELECT product_id, productname, package_id, prodcolor, category_id, saleprice, status, prodimage FROM product WHERE homepage = true";
  db.query(productQuery, (err, productResult) => {
    if (err) {
      console.log(err);
      res.render('error');
    }
let promotionQuery = "select promotitle, promoimage from promotion where startdate <= current_date() and enddate >= current_date()";
    db.query(promotionQuery, (err, promotionResult) => {
      if (err) {
        console.log(err);
        res.render('error');
      }
      console.log(promotionResult);
      res.render('index', {allrecs: productResult, promos: promotionResult, title: "Nacho Tech"});
    });
  });
});

module.exports = router;

