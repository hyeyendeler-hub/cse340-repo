const express = require('express');
const path = require('path');

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

app.get('/organizations', (req, res) => {
  res.render('organizations', {
    title: 'Organizations',
    navItems,
    currentPath: '/organizations'
  });
});

app.get('/projects', (req, res) => {
  res.render('projects', {
    title: 'Projects',
    navItems,
    currentPath: '/projects'
  });
});

app.get('/categories', (req, res) => {
  res.render('categories', {
    title: 'Categories',
    navItems,
    currentPath: '/categories'
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
