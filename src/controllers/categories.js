// Import any needed model functions
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    getCategoriesByServiceProjectId,
    updateCategoryAssignments
} from '../models/categories.js';

import {
    getProjectsForCategory,
    getProjectDetails
} from '../models/projects.js';
import { body, validationResult } from 'express-validator';

const categoryValidation = [
    body('categoryName')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 2, max: 150 })
        .withMessage('Category name must be between 2 and 150 characters')
];

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;

        const categoryDetails = await getCategoryById(categoryId);

        if (!categoryDetails) {
            const err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }

        const projects = await getProjectsForCategory(categoryId);

        res.render('category', {
            title: categoryDetails.category_name,
            categoryDetails,
            projects
        });
    } catch (error) {
        next(error);
    }
};

const showNewCategoryForm = (req, res) => {
    res.render('new-category', { title: 'Add New Category' });
};

const processNewCategoryForm = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => req.flash('error', error.msg));
        return res.redirect('/new-category');
    }

    try {
        const categoryId = await createCategory(req.body.categoryName);
        req.flash('success', 'Category added successfully!');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        next(error);
    }
};

const showEditCategoryForm = async (req, res, next) => {
    try {
        const categoryDetails = await getCategoryById(req.params.id);
        if (!categoryDetails) {
            const err = new Error('Category Not Found');
            err.status = 404;
            return next(err);
        }

        res.render('edit-category', {
            title: 'Edit Category',
            categoryDetails
        });
    } catch (error) {
        next(error);
    }
};

const processEditCategoryForm = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => req.flash('error', error.msg));
        return res.redirect(`/edit-category/${req.params.id}`);
    }

    try {
        const updatedCategory = await updateCategory(
            req.params.id,
            req.body.categoryName
        );
        if (!updatedCategory) {
            const err = new Error('Category Not Found');
            err.status = 404;
            return next(err);
        }

        req.flash('success', 'Category updated successfully!');
        res.redirect(`/category/${req.params.id}`);
    } catch (error) {
        next(error);
    }
};

const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const { projectId } = req.params;

        const projectDetails = await getProjectDetails(projectId);
        if (!projectDetails) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        const categories = await getAllCategories();
        const assignedCategories =
            await getCategoriesByServiceProjectId(projectId);

        res.render('assign-categories', {
            title: 'Assign Categories to Project',
            projectId,
            projectDetails,
            categories,
            assignedCategories
        });
    } catch (error) {
        next(error);
    }
};

const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        let { categoryIds } = req.body;

        if (!categoryIds) {
            categoryIds = [];
        } else if (!Array.isArray(categoryIds)) {
            categoryIds = [categoryIds];
        }

        const validCategoryIds = new Set(
            (await getAllCategories()).map((category) => String(category.category_id))
        );
        if (categoryIds.some((categoryId) => !validCategoryIds.has(String(categoryId)))) {
            req.flash('error', 'One or more selected categories are invalid.');
            return res.redirect(`/assign-categories/${projectId}`);
        }

        await updateCategoryAssignments(projectId, categoryIds);

        req.flash('success', 'Categories updated successfully.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};

// Export any controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};