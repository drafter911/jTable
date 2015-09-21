var express = require('express');
var router = express.Router();

router.get('/data', function (req, res, next) {

  res.render('index', { title: 'DataTable by drafter911@gmail.com' });
});

module.exports = router;
