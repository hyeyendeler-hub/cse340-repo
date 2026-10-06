import pool from './db.js';

export async function addVolunteer(user_id, project_id) {
    const sql = `
        INSERT INTO project_volunteer (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING
        RETURNING volunteer_id
    `;

    const result = await pool.query(sql, [user_id, project_id]);
    return result.rows[0];
}

export async function removeVolunteer(user_id, project_id) {
    const sql = `
        DELETE FROM project_volunteer
        WHERE user_id = $1 AND project_id = $2
        RETURNING volunteer_id
    `;

    const result = await pool.query(sql, [user_id, project_id]);
    return result.rows[0];
}

export async function getVolunteerProjects(user_id) {
    const sql = `
        SELECT p.*
        FROM project_volunteer pv
        JOIN project p
            ON pv.project_id = p.project_id
        WHERE pv.user_id = $1
        ORDER BY p.title
    `;

    const result = await pool.query(sql, [user_id]);
    return result.rows;
}

export async function checkVolunteer(user_id, project_id) {
    const sql = `
        SELECT volunteer_id
        FROM project_volunteer
        WHERE user_id = $1 AND project_id = $2
    `;

    const result = await pool.query(sql, [user_id, project_id]);
    return result.rowCount > 0;
}