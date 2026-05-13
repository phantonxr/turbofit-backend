"use strict";
const { query } = require('../db');
async function getCompletedWorkoutsCount(userId) {
    const { rows } = await query('select count(*)::int as count from user_workout_progress where user_id = $1 and completed = true', [userId]);
    return rows[0]?.count ?? 0;
}
async function getCurrentDay(userId) {
    const completed = await getCompletedWorkoutsCount(userId);
    const day = Math.min(completed + 1, 21);
    return day;
}
module.exports = {
    getCompletedWorkoutsCount,
    getCurrentDay,
};
