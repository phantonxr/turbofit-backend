const express = require('express');
const { z } = require('zod');
const auth = require('../middleware/auth');
const { query } = require('../db');

const router = express.Router();

const MeasurementSchema = z.object({
  weight_kg: z.number().positive().max(500).nullable().optional(),
  height_cm: z.number().positive().max(300).nullable().optional(),
  waist_cm: z.number().positive().max(300).nullable().optional(),
  hip_cm: z.number().positive().max(300).nullable().optional(),
  chest_cm: z.number().positive().max(300).nullable().optional(),
  thigh_cm: z.number().positive().max(300).nullable().optional(),
  arm_cm: z.number().positive().max(300).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
  measured_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

router.get('/measurements/latest', auth, async (req, res, next) => {
  try {
    const { rows } = await query(
      `select id, weight_kg, height_cm, waist_cm, hip_cm, chest_cm, thigh_cm, arm_cm, notes, measured_at, created_at
       from user_measurements
       where user_id = $1
       order by measured_at desc, created_at desc
       limit 1`,
      [req.user.id]
    );
    return res.json({ measurement: rows[0] || null });
  } catch (err) {
    return next(err);
  }
});

router.get('/measurements', auth, async (req, res, next) => {
  try {
    const { rows } = await query(
      `select id, weight_kg, height_cm, waist_cm, hip_cm, chest_cm, thigh_cm, arm_cm, notes, measured_at, created_at
       from user_measurements
       where user_id = $1
       order by measured_at desc, created_at desc
       limit 20`,
      [req.user.id]
    );
    return res.json({ measurements: rows });
  } catch (err) {
    return next(err);
  }
});

router.post('/measurements', auth, async (req, res, next) => {
  try {
    const data = MeasurementSchema.parse(req.body);

    const { rows } = await query(
      `insert into user_measurements
         (id, user_id, weight_kg, height_cm, waist_cm, hip_cm, chest_cm, thigh_cm, arm_cm, notes, measured_at)
       values
         (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       returning id, weight_kg, height_cm, waist_cm, hip_cm, chest_cm, thigh_cm, arm_cm, notes, measured_at, created_at`,
      [
        req.user.id,
        data.weight_kg ?? null,
        data.height_cm ?? null,
        data.waist_cm ?? null,
        data.hip_cm ?? null,
        data.chest_cm ?? null,
        data.thigh_cm ?? null,
        data.arm_cm ?? null,
        data.notes ?? null,
        data.measured_at ?? new Date().toISOString().slice(0, 10),
      ]
    );

    return res.status(201).json({ measurement: rows[0] });
  } catch (err) {
    if (err?.name === 'ZodError') {
      return res.status(400).json({ error: 'Dados inválidos', details: err.issues });
    }
    return next(err);
  }
});

module.exports = router;
