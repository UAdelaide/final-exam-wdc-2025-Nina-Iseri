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

router.get('/', (req, res, next) => {
    res.render('owner')
})

module.exports = router;