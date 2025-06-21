const express = require('express');
const router = express.Router();

// GET home page
router.get('/', (req, res, next) => {
    let user_id = req.session.user_id || '';
    if (!user_id.length) {
        res.render()
    }
});

module.exports = router;