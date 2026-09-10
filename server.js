const express = require('express');
const path = require('path');
const {
  getOrganizations,
  getProjects,
  getCategories
} = require('./models/community-model');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Organizations', href: '/organizations' },
  { name: 'Projects', href: '/projects' },
  { name: 'Categories', href: '/categories' }
];

app.get('/', (req, res) => {
  res.render('home', {
    title: 'Home',
    navItems,
    currentPath: '/'
  });
});

app.get('/organizations', async (req, res, next) => {
  try {
    const organizations = await getOrganizations();
    res.render('organizations', {
      title: 'Organizations',
      navItems,
      currentPath: '/organizations',
      organizations
    });
  } catch (error) {
    next(error);
  }
});

app.get('/projects', async (req, res, next) => {
  try {
    const projects = await getProjects();
    res.render('projects', {
      title: 'Projects',
      navItems,
      currentPath: '/projects',
      projects
    });
  } catch (error) {
    next(error);
  }
});

app.get('/categories', async (req, res, next) => {
  try {
    const categories = await getCategories();
    res.render('categories', {
      title: 'Categories',
      navItems,
      currentPath: '/categories',
      categories
    });
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).render('404', {
    title: 'Page Not Found',
    navItems,
    currentPath: req.path
  });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send('Unable to load data. Check the database connection.');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
