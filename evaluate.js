var express = require('express');
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();

router.get('/page', function(req, res, next) {
    res.redirect('/evaluate/page/1');
});

router.get('/page/:page', function(req, res, next) {
    var page = req.params.page;
    var sql = "SELECT idx, name, dept_name, role_name, proj_name FROM evaluate;";
    conn.query(sql, function(err, rows) {
        if(err) console.error("err: " + err);
        res.render('eval_list', {title: '평가 대상 선택', rows: rows,
            page: page, length: rows.length - 1, page_num: 5, pass: true});
    });
});

router.get('/eval/:idx', function(req, res, next) {
    var idx = req.params.idx;
    var sql = "SELECT idx, name, dept_name, role_name, proj_name FROM evaluate WHERE idx=?;";
    conn.query(sql, [idx], function(err, rows) {
        if(err) console.error("err: " + err);
        res.render('evaluate', {title: '성과 평가', row: rows[0]});
    });
});

router.post('/write', function(req, res, next) {
    res.redirect('/evaluate/page');
});

module.exports = router;
