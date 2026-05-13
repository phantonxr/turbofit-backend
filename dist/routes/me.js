"use strict";
const express = require('express');
const { z } = require('zod');
const auth = require('../middleware/auth');
const { query } = require('../db');
const router = express.Router();
router.get('/me', auth, async (req, res, next) => {
    try {
        const { rows } = await query('select id, name, email, main_goal, pain_notes, subscription_status, created_at from users where id = $1', [req.user.id]);
        const user = rows[0];
        if (!user)
            return res.status(404).json({ error: 'Usuário não encontrado' });
        return res.json({ user });
    }
    catch (err) {
        return next(err);
    }
});
const PatchSchema = z
    .object({
    name: z.string().min(2).optional(),
    main_goal: z
        .enum([
        'reduzir barriga',
        'levantar bumbum',
        'modelar pernas',
        'emagrecer alguns quilos',
        'ganhar disposição',
    ])
        .optional(),
    pain_notes: z.string().max(500).optional().nullable(),
})
    .refine((v) => Object.keys(v).length > 0, 'Envie ao menos um campo');
router.patch('/me', auth, async (req, res, next) => {
    try {
        const data = PatchSchema.parse(req.body);
        const fields = [];
        const values = [];
        let idx = 1;
        for (const [key, value] of Object.entries(data)) {
            fields.push(`${key} = $${idx}`);
            values.push(value);
            idx += 1;
        }
        values.push(req.user.id);
        const { rows } = await query(`update users set ${fields.join(', ')} where id = $${idx}
       returning id, name, email, main_goal, pain_notes, subscription_status, created_at`, values);
        return res.json({ user: rows[0] });
    }
    catch (err) {
        if (err?.name === 'ZodError') {
            return res.status(400).json({ error: 'Dados inválidos', details: err.issues });
        }
        return next(err);
    }
});
module.exports = router;
