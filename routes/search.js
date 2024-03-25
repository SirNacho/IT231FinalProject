var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    let query = "SELECT product_id, productname, prodcolor, package_id, category_id, saleprice, status FROM product WHERE description LIKE '%" + req.query.searchcriteria + "%'";

    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('search', {allrecs: result});
        }
    });
});

module.exports = router;