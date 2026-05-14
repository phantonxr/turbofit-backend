"use strict";
const express = require('express');
const { z } = require('zod');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const { query } = require('../db');
const router = express.Router();
router.use(auth, requireAdmin);
// ── Usuários ────────────────────────────────────────────────────────────────
router.get('/admin/users', async (req, res, next) => {
    try {
        const { rows } = await query('select id, name, email, subscription_status, role, created_at from users order by created_at desc');
        return res.json({ users: rows });
    }
    catch (err) {
        return next(err);
    }
});
const PatchUserSchema = z.object({
    subscription_status: z.enum(['active', 'inactive', 'past_due']).optional(),
    role: z.enum(['user', 'admin']).optional(),
});
router.patch('/admin/users/:id', async (req, res, next) => {
    try {
        const data = PatchUserSchema.parse(req.body);
        const fields = Object.keys(data);
        if (!fields.length)
            return res.status(400).json({ error: 'Nenhum campo para atualizar' });
        const sets = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
        const values = fields.map((f) => data[f]);
        values.push(req.params.id);
        const { rows } = await query(`update users set ${sets} where id = $${values.length} returning id, name, email, subscription_status, role`, values);
        if (!rows.length)
            return res.status(404).json({ error: 'Usuário não encontrado' });
        return res.json({ user: rows[0] });
    }
    catch (err) {
        if (err?.name === 'ZodError')
            return res.status(400).json({ error: 'Dados inválidos', details: err.issues });
        return next(err);
    }
});
router.delete('/admin/users/:id', async (req, res, next) => {
    try {
        const { rowCount } = await query('delete from users where id = $1', [req.params.id]);
        if (!rowCount)
            return res.status(404).json({ error: 'Usuário não encontrado' });
        return res.json({ ok: true });
    }
    catch (err) {
        return next(err);
    }
});
router.get('/admin/users/:id/progress', async (req, res, next) => {
    try {
        const { rows: workouts } = await query(`select w.id, w.day_number, w.title, uwp.completed, uwp.completed_at
       from workouts w
       left join user_workout_progress uwp on uwp.workout_id = w.id and uwp.user_id = $1
       order by w.day_number asc`, [req.params.id]);
        const { rows: habits } = await query(`select h.id, h.day_number, h.title, uhp.status, uhp.fail_reason, uhp.completed_at
       from habits h
       left join user_habit_progress uhp on uhp.habit_id = h.id and uhp.user_id = $1
       order by h.day_number asc`, [req.params.id]);
        return res.json({ workouts, habits });
    }
    catch (err) {
        return next(err);
    }
});
// ── Workouts ────────────────────────────────────────────────────────────────
const WorkoutSchema = z.object({
    day_number: z.number().int().positive(),
    title: z.string().min(1),
    focus: z.string().min(1),
    duration_minutes: z.number().int().positive(),
    description: z.string().optional().nullable(),
    video_url: z.string().url().optional().nullable(),
});
router.post('/admin/workouts', async (req, res, next) => {
    try {
        const data = WorkoutSchema.parse(req.body);
        const { rows } = await query(`insert into workouts (id, day_number, title, focus, duration_minutes, description, video_url)
       values (gen_random_uuid(), $1, $2, $3, $4, $5, $6)
       returning *`, [data.day_number, data.title, data.focus, data.duration_minutes, data.description ?? null, data.video_url ?? null]);
        return res.status(201).json({ workout: rows[0] });
    }
    catch (err) {
        if (err?.name === 'ZodError')
            return res.status(400).json({ error: 'Dados inválidos', details: err.issues });
        return next(err);
    }
});
router.patch('/admin/workouts/:id', async (req, res, next) => {
    try {
        const data = WorkoutSchema.partial().parse(req.body);
        const fields = Object.keys(data);
        if (!fields.length)
            return res.status(400).json({ error: 'Nenhum campo para atualizar' });
        const sets = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
        const values = fields.map((f) => data[f]);
        values.push(req.params.id);
        const { rows } = await query(`update workouts set ${sets} where id = $${values.length} returning *`, values);
        if (!rows.length)
            return res.status(404).json({ error: 'Treino não encontrado' });
        return res.json({ workout: rows[0] });
    }
    catch (err) {
        if (err?.name === 'ZodError')
            return res.status(400).json({ error: 'Dados inválidos', details: err.issues });
        return next(err);
    }
});
router.delete('/admin/workouts/:id', async (req, res, next) => {
    try {
        const { rowCount } = await query('delete from workouts where id = $1', [req.params.id]);
        if (!rowCount)
            return res.status(404).json({ error: 'Treino não encontrado' });
        return res.json({ ok: true });
    }
    catch (err) {
        return next(err);
    }
});
// ── Habits ──────────────────────────────────────────────────────────────────
const HabitSchema = z.object({
    day_number: z.number().int().positive(),
    title: z.string().min(1),
    description: z.string().optional().nullable(),
});
router.post('/admin/habits', async (req, res, next) => {
    try {
        const data = HabitSchema.parse(req.body);
        const { rows } = await query(`insert into habits (id, day_number, title, description)
       values (gen_random_uuid(), $1, $2, $3)
       returning *`, [data.day_number, data.title, data.description ?? null]);
        return res.status(201).json({ habit: rows[0] });
    }
    catch (err) {
        if (err?.name === 'ZodError')
            return res.status(400).json({ error: 'Dados inválidos', details: err.issues });
        return next(err);
    }
});
router.patch('/admin/habits/:id', async (req, res, next) => {
    try {
        const data = HabitSchema.partial().parse(req.body);
        const fields = Object.keys(data);
        if (!fields.length)
            return res.status(400).json({ error: 'Nenhum campo para atualizar' });
        const sets = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
        const values = fields.map((f) => data[f]);
        values.push(req.params.id);
        const { rows } = await query(`update habits set ${sets} where id = $${values.length} returning *`, values);
        if (!rows.length)
            return res.status(404).json({ error: 'Hábito não encontrado' });
        return res.json({ habit: rows[0] });
    }
    catch (err) {
        if (err?.name === 'ZodError')
            return res.status(400).json({ error: 'Dados inválidos', details: err.issues });
        return next(err);
    }
});
router.delete('/admin/habits/:id', async (req, res, next) => {
    try {
        const { rowCount } = await query('delete from habits where id = $1', [req.params.id]);
        if (!rowCount)
            return res.status(404).json({ error: 'Hábito não encontrado' });
        return res.json({ ok: true });
    }
    catch (err) {
        return next(err);
    }
});
// ── Vídeos ──────────────────────────────────────────────────────────────────
const VideoSchema = z.object({
    title: z.string().min(1),
    category: z.string().min(1),
    duration_minutes: z.number().int().positive(),
    video_url: z.string().url().optional().nullable(),
    thumbnail_url: z.string().url().optional().nullable(),
    description: z.string().optional().nullable(),
});
router.post('/admin/videos', async (req, res, next) => {
    try {
        const data = VideoSchema.parse(req.body);
        const { rows } = await query(`insert into videos (id, title, category, duration_minutes, video_url, thumbnail_url, description)
       values (gen_random_uuid(), $1, $2, $3, $4, $5, $6)
       returning *`, [data.title, data.category, data.duration_minutes, data.video_url ?? null, data.thumbnail_url ?? null, data.description ?? null]);
        return res.status(201).json({ video: rows[0] });
    }
    catch (err) {
        if (err?.name === 'ZodError')
            return res.status(400).json({ error: 'Dados inválidos', details: err.issues });
        return next(err);
    }
});
router.patch('/admin/videos/:id', async (req, res, next) => {
    try {
        const data = VideoSchema.partial().parse(req.body);
        const fields = Object.keys(data);
        if (!fields.length)
            return res.status(400).json({ error: 'Nenhum campo para atualizar' });
        const sets = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
        const values = fields.map((f) => data[f]);
        values.push(req.params.id);
        const { rows } = await query(`update videos set ${sets} where id = $${values.length} returning *`, values);
        if (!rows.length)
            return res.status(404).json({ error: 'Vídeo não encontrado' });
        return res.json({ video: rows[0] });
    }
    catch (err) {
        if (err?.name === 'ZodError')
            return res.status(400).json({ error: 'Dados inválidos', details: err.issues });
        return next(err);
    }
});
router.delete('/admin/videos/:id', async (req, res, next) => {
    try {
        const { rowCount } = await query('delete from videos where id = $1', [req.params.id]);
        if (!rowCount)
            return res.status(404).json({ error: 'Vídeo não encontrado' });
        return res.json({ ok: true });
    }
    catch (err) {
        return next(err);
    }
});
module.exports = router;
