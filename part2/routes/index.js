const express = require('express');
const router = express.Router();

// GET home page
router.get('/', (req, res, next) => {
    let role = req.session.role || '';
    if (!role.length) {
        res.render('index');
    }
    res.redirect(`/${role}-dashboard`);
});

router.get('/owner-dashboard', (req, res, next) => {
    res.render('owner-dashboard');
});

router.get('/walker-dashboard', (req, res, next) => {
    res.render('walker-dashboard');
});



module.exports = router;