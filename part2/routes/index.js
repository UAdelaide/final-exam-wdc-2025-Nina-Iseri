const express = require('express');
const router = express.Router();

// GET home page
router.get('/', (req, res, next) => {
    let role = req.session.role || '';
    if (!user_id.length) {
        res.render('index');
    }
    
});

module.exports = router;