const express = require('express');
const router = express.Router();

// GET home page
router.get('/', (req, res, next) => {
    let role = req.session.role || '';
    if (!role.length) {
        res.render('index');
    }
    res.redirect()
});

module.exports = router;