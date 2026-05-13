const express = require('express');
const { z } = require('zod');
const auth = require('../middleware/auth');
const { query } = require('../db');
const { getCurrentDay } = require('../services/progress');

const router = express.Router();

router.get('/habits/today', auth, async (req, res, next) => {
  try {
    const day = await getCurrentDay(req.user.id);

    const { rows } = await query(
      `select h.id, h.day_number, h.title, h.description,
              uhp.status, uhp.fail_reason, uhp.completed_at
       from habits h
       left join user_habit_progress uhp
         on uhp.habit_id = h.id and uhp.user_id = $1
       where h.day_number = $2
       order by h.created_at asc`,
      [req.user.id, day]
    );

    return res.json({ dayNumber: day, habits: rows });
  } catch (err) {
    return next(err);
  }
});

router.get('/habits', auth, async (req, res, next) => {
  try {
    const day = await getCurrentDay(req.user.id);

    const { rows } = await query(
      `select h.id, h.day_number, h.title, h.description,
              uhp.status, uhp.fail_reason, uhp.completed_at, uhp.created_at as progress_created_at
       from habits h
       left join user_habit_progress uhp
         on uhp.habit_id = h.id and uhp.user_id = $1
       order by h.day_number asc, h.created_at asc`,
      [req.user.id]
    );

    return res.json({ currentDay: day, habits: rows });
  } catch (err) {
    return next(err);
  }
});

router.post('/habits/:id/complete', auth, async (req, res, next) => {
  try {
    const day = await getCurrentDay(req.user.id);

    const { rows: hr } = await query('select id, day_number from habits where id = $1', [req.params.id]);
    const habit = hr[0];
    if (!habit) return res.status(404).json({ error: 'Hábito não encontrado' });
    if (habit.day_number !== day) {
      return res.status(403).json({ error: 'Você só pode marcar os hábitos do dia atual' });
    }

    await query(
      `insert into user_habit_progress (id, user_id, habit_id, status, fail_reason, completed_at)
       values (gen_random_uuid(), $1, $2, 'completed', null, now())
       on conflict (user_id, habit_id)
       do update set status = 'completed', fail_reason = null, completed_at = now()`,
      [req.user.id, habit.id]
    );

    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

const FailSchema = z.object({
  reason: z.string().min(5, 'Conte um pouco do motivo').max(300),
});

router.post('/habits/:id/fail', auth, async (req, res, next) => {
  try {
    const { reason } = FailSchema.parse(req.body);

    const day = await getCurrentDay(req.user.id);

    const { rows: hr } = await query('select id, day_number from habits where id = $1', [req.params.id]);
    const habit = hr[0];
    if (!habit) return res.status(404).json({ error: 'Hábito não encontrado' });
    if (habit.day_number !== day) {
      return res.status(403).json({ error: 'Você só pode marcar os hábitos do dia atual' });
    }

    await query(
      `insert into user_habit_progress (id, user_id, habit_id, status, fail_reason, completed_at)
       values (gen_random_uuid(), $1, $2, 'failed', $3, now())
       on conflict (user_id, habit_id)
       do update set status = 'failed', fail_reason = $3, completed_at = now()`,
      [req.user.id, habit.id, reason]
    );

    return res.json({ ok: true });
  } catch (err) {
    if (err?.name === 'ZodError') {
      return res.status(400).json({ error: 'Dados inválidos', details: err.issues });
    }
    return next(err);
  }
});

module.exports = router;
