// Import any needed model functions
import { getAllProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesForProject } from '../models/categories.js';

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getAllProjects();
    const title = 'Service Projects';

    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res, next) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);

    if (!projectDetails) {
        const err = new Error('Project Not Found');
        err.status = 404;
        return next(err);
    }

    const categories = await getCategoriesForProject(projectId);
    const title = 'Project Details';

    res.render('project', { title, projectDetails, categories });
};

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };