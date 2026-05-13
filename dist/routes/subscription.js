"use strict";
const express = require('express');
const auth = require('../middleware/auth');
const { query } = require('../db');
const router = express.Router();
router.get('/subscription/status', auth, async (req, res, next) => {
    try {
        const { rows } = await query('select subscription_status from users where id = $1', [req.user.id]);
        return res.json({ status: rows[0]?.subscription_status ?? 'inactive' });
    }
    catch (err) {
        return next(err);
    }
});
module.exports = router;
