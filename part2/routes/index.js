const express = require('express');
const router = express.Router();

// GET home page
router.get('/', (req, res, next) => {
    console.log('using index');
    let role = req.session.role || '';
    if (!role.length) {
        res.render('index');
    }
    res.redirect(`/redirect`);
});

router.get('/redirect', (req, res, next) => {
    let role = req.session.role || '';
    res.render(`${role}-dashboard`);
});

module.exports = router;
