"use strict";
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { query } = require('../db');
const router = express.Router();
const RegisterSchema = z.object({
    name: z.string().min(2, 'Nome obrigatório'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    main_goal: z.enum([
        'reduzir barriga',
        'levantar bumbum',
        'modelar pernas',
        'emagrecer alguns quilos',
        'ganhar disposição',
    ]),
    pain_notes: z.string().max(500).optional().nullable(),
});
router.post('/register', async (req, res, next) => {
    try {
        const data = RegisterSchema.parse(req.body);
        const { rows: existing } = await query('select id from users where email = $1', [data.email.toLowerCase()]);
        if (existing.length)
            return res.status(409).json({ error: 'Este e-mail já está cadastrado' });
        const passwordHash = await bcrypt.hash(data.password, 10);
        const { rows } = await query(`insert into users (id, name, email, password_hash, main_goal, pain_notes)
       values (gen_random_uuid(), $1, $2, $3, $4, $5)
       returning id, name, email, main_goal, pain_notes, subscription_status, created_at`, [data.name, data.email.toLowerCase(), passwordHash, data.main_goal, data.pain_notes ?? null]);
        const user = rows[0];
        const token = jwt.sign({}, process.env.JWT_SECRET, { subject: user.id, expiresIn: '30d' });
        return res.status(201).json({ token, user });
    }
    catch (err) {
        if (err?.name === 'ZodError') {
            return res.status(400).json({ error: 'Dados inválidos', details: err.issues });
        }
        return next(err);
    }
});
const LoginSchema = z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(1, 'Senha obrigatória'),
});
router.post('/login', async (req, res, next) => {
    try {
        const data = LoginSchema.parse(req.body);
        const { rows } = await query('select id, name, email, password_hash, main_goal, pain_notes, subscription_status from users where email = $1', [
            data.email.toLowerCase(),
        ]);
        const user = rows[0];
        if (!user)
            return res.status(401).json({ error: 'E-mail ou senha inválidos' });
        const ok = await bcrypt.compare(data.password, user.password_hash);
        if (!ok)
            return res.status(401).json({ error: 'E-mail ou senha inválidos' });
        const token = jwt.sign({}, process.env.JWT_SECRET, { subject: user.id, expiresIn: '30d' });
        delete user.password_hash;
        return res.json({ token, user });
    }
    catch (err) {
        if (err?.name === 'ZodError') {
            return res.status(400).json({ error: 'Dados inválidos', details: err.issues });
        }
        return next(err);
    }
});
module.exports = router;
