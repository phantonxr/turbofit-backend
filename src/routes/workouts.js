const express = require('express');
const { z } = require('zod');
const auth = require('../middleware/auth');
const { query } = require('../db');
const { getCurrentDay } = require('../services/progress');

const router = express.Router();

async function listWorkoutsForUser(userId) {
  const currentDay = await getCurrentDay(userId);

  const { rows } = await query(
    `select w.id, w.day_number, w.title, w.focus, w.duration_minutes, w.description, w.video_url,
            coalesce(uwp.completed, false) as completed
     from workouts w
     left join user_workout_progress uwp
       on uwp.workout_id = w.id and uwp.user_id = $1
     order by w.day_number asc`,
    [userId]
  );

  const workouts = rows.map((w) => {
    let status = 'bloqueado';
    if (w.completed) status = 'concluido';
    else if (w.day_number <= currentDay) status = 'disponivel';

    return {
      ...w,
      status,
    };
  });

  return { workouts, currentDay };
}

router.get('/workouts', auth, async (req, res, next) => {
  try {
    const { workouts, currentDay } = await listWorkoutsForUser(req.user.id);
    return res.json({ workouts, currentDay });
  } catch (err) {
    return next(err);
  }
});

router.get('/workouts/today', auth, async (req, res, next) => {
  try {
    const currentDay = await getCurrentDay(req.user.id);
    const { rows } = await query(
      `select w.id, w.day_number, w.title, w.focus, w.duration_minutes, w.description, w.video_url,
              coalesce(uwp.completed, false) as completed
       from workouts w
       left join user_workout_progress uwp
         on uwp.workout_id = w.id and uwp.user_id = $1
       where w.day_number = $2`,
      [req.user.id, currentDay]
    );

    return res.json({ workout: rows[0] ?? null, currentDay });
  } catch (err) {
    return next(err);
  }
});

const CompleteSchema = z.object({});

router.post('/workouts/:id/complete', auth, async (req, res, next) => {
  try {
    CompleteSchema.parse(req.body ?? {});

    const currentDay = await getCurrentDay(req.user.id);

    const { rows: wr } = await query('select id, day_number from workouts where id = $1', [req.params.id]);
    const workout = wr[0];
    if (!workout) return res.status(404).json({ error: 'Treino não encontrado' });

    if (workout.day_number > currentDay) {
      return res.status(403).json({ error: 'Este treino ainda está bloqueado. Siga a progressão do plano.' });
    }

    await query(
      `insert into user_workout_progress (id, user_id, workout_id, completed, completed_at)
       values (gen_random_uuid(), $1, $2, true, now())
       on conflict (user_id, workout_id)
       do update set completed = true, completed_at = now()`,
      [req.user.id, workout.id]
    );

    const newDay = await getCurrentDay(req.user.id);

    return res.json({ ok: true, currentDay: newDay });
  } catch (err) {
    if (err?.name === 'ZodError') {
      return res.status(400).json({ error: 'Dados inválidos', details: err.issues });
    }
    return next(err);
  }
});

module.exports = router;
