"use strict";
const express = require('express');
const auth = require('../middleware/auth');
const { query } = require('../db');
const router = express.Router();
router.get('/videos', auth, async (req, res, next) => {
    try {
        const { rows } = await query('select id, title, category, duration_minutes, video_url, thumbnail_url, description from videos order by category asc, created_at asc');
        return res.json({ videos: rows });
    }
    catch (err) {
        return next(err);
    }
});
module.exports = router;
