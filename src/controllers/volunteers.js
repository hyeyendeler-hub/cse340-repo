import * as volunteers from '../models/volunteers.js';

export async function addVolunteer(req, res) {
    try {
        const user_id = req.session.user.user_id;
        const project_id = req.params.project_id;

        await volunteers.addVolunteer(user_id, project_id);

        res.redirect(`/project/${project_id}`);
    } catch (error) {
        console.error('Error adding volunteer:', error);
        res.status(500).send('Unable to volunteer for this project.');
    }
}

export async function removeVolunteer(req, res) {
    try {
        const user_id = req.session.user.user_id;
        const project_id = req.params.project_id;

        await volunteers.removeVolunteer(user_id, project_id);

        res.redirect(`/project/${project_id}`);
    } catch (error) {
        console.error('Error removing volunteer:', error);
        res.status(500).send('Unable to remove volunteer.');
    }
}