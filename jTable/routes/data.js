var express = require('express');
var router = express.Router();

var data = require('../data/data.json');

var page;

router.get('/data', function (req, res, next) {
    var parameters = req.query;
    if (parameters.hasOwnProperty('limit') === false) {
        parameters.limit = 20;
    }
    if (parameters.hasOwnProperty('offset') === false) {
        parameters.offset = 0;
    }
    if (parameters.hasOwnProperty('page') == false) {
        req.params.page = parameters.offset / 10;
    }
    if (parameters.hasOwnProperty('sortBy')) {
        data.sort(function (a, b) {
            if (+a[parameters.sortBy] > +b[parameters.sortBy])
                return 1;
            if (+a[parameters.sortBy] < +b[parameters.sortBy])
                return -1;
            return 0;
        });
    }
    var pagedData = [];
    for (var i = parameters.offset; i < (+parameters.limit + +parameters.offset); i++) {
        pagedData.push(data[i]);
    }

    page = Math.ceil((+parameters.offset / 20) + 1);
    res.send({table: pagedData, page: page, count: data.length});
});

router.post('/data', function (req, res, next) {
    var dataElem = req.body;
    data.push(dataElem);
    dataElem._id = data.length;
    res.send({elem: dataElem, count: data.length});
});

module.exports = router;
