// Import any needed model functions
import { getAllCategories, getCategoryById } from '../models/categories.js';
import { getProjectsForCategory } from '../models/projects.js';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res, next) => {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryById(categoryId);

    if (!categoryDetails) {
        const err = new Error('Category Not Found');
        err.status = 404;
        return next(err);
    }

    const projects = await getProjectsForCategory(categoryId);
    const title = 'Category Details';

    res.render('category', { title, categoryDetails, projects });
};

// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage };