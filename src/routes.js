import express from 'express';
import { showHomePage } from './controllers/index.js';
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    organizationValidation,
    processEditOrganizationForm
} from './controllers/organizations.js';
import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
} from './controllers/projects.js';
import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation,
    showAssignCategoriesForm,
    processAssignCategoriesForm
} from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/new-organization', showNewOrganizationForm);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.get('/test-error', testErrorPage);
router.post(
    '/new-organization',
    organizationValidation,
    processNewOrganizationForm
);

router.get('/new-project', showNewProjectForm);

router.post(
    '/new-project',
    projectValidation,
    processNewProjectForm
);

router.get('/edit-project/:id', showEditProjectForm);
router.post(
    '/edit-project/:id',
    projectValidation,
    processEditProjectForm
);

router.get('/new-category', showNewCategoryForm);
router.post(
    '/new-category',
    categoryValidation,
    processNewCategoryForm
);

router.get('/edit-category/:id', showEditCategoryForm);
router.post(
    '/edit-category/:id',
    categoryValidation,
    processEditCategoryForm
);

router.get(
    '/project/:projectId/assign-categories',
    showAssignCategoriesForm
);

router.post(
    '/project/:projectId/assign-categories',
    processAssignCategoriesForm
);

router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

router.post(
    '/edit-organization/:id',
    organizationValidation,
    processEditOrganizationForm
);

router.get('/edit-profile/:id', showEditOrganizationForm);
router.post(
    '/edit-profile/:id',
    organizationValidation,
    processEditOrganizationForm
);

export default router;