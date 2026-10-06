// Import any needed model functions
import {
    getAllProjects,
    getProjectDetails,
    createProject,
    updateProject
} from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';
import {
    getCategoriesForProject
} from '../models/categories.js';

import { checkVolunteer } from '../models/volunteers.js';

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getAllProjects();
    const title = 'Service Projects';

    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const projectDetails = await getProjectDetails(projectId);

        if (!projectDetails) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        const categories = await getCategoriesForProject(projectId);

        let isVolunteer = false;

        if (req.session.user) {
            isVolunteer = await checkVolunteer(
                req.session.user.user_id,
                projectId
            );
        }

        const title = 'Project Details';

        res.render('project', {
            title,
            projectDetails,
            categories,
            isVolunteer,
            currentUser: req.session.user
        });
    } catch (error) {
        next(error);
    }
};

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters'),

    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 })
        .withMessage('Location cannot exceed 200 characters'),

    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Please enter a valid date'),

    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt({ min: 1 }).withMessage('Please select a valid organization')
];

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();

    res.render('new-project', {
        title: 'Add New Service Project',
        organizations
    });
};

const showEditProjectForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const projectDetails = await getProjectDetails(projectId);

        if (!projectDetails) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        const organizations = await getAllOrganizations();
        res.render('edit-project', {
            title: 'Edit Service Project',
            projectDetails,
            organizations
        });
    } catch (error) {
        next(error);
    }
};

const processEditProjectForm = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => req.flash('error', error.msg));
        return res.redirect(`/edit-project/${req.params.id}`);
    }

    try {
        const { title, description, location, date, organizationId } = req.body;
        const updatedProject = await updateProject(
            req.params.id,
            title,
            description,
            location,
            date,
            organizationId
        );

        if (!updatedProject) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        req.flash('success', 'Service project updated successfully!');
        res.redirect(`/project/${req.params.id}`);
    } catch (error) {
        next(error);
    }
};

const processNewProjectForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    const { title, description, location, date, organizationId } = req.body;

    try {
        const projectId = await createProject(
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error creating project:', error);
        req.flash('error', 'Unable to create the project.');
        res.redirect('/new-project');
    }
};

// Export any controller functions
export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
};