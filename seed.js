import 'dotenv/config';
import db from './src/models/db.js';

const organizations = [
  {
    name: 'BrightFuture Builders',
    description: 'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    contact_email: 'info@brightfuturebuilders.org',
    logo_filename: 'brightfuture-logo.png'
  },
  {
    name: 'GreenHarvest Growers',
    description: 'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    contact_email: 'contact@greenharvest.org',
    logo_filename: 'greenharvest-logo.png'
  },
  {
    name: 'UnityServe Volunteers',
    description: 'A volunteer coordination group supporting local charities and service initiatives.',
    contact_email: 'hello@unityserve.org',
    logo_filename: 'unityserve-logo.png'
  }
];

const categories = [
  'Environment',
  'Food Security',
  'Education',
  'Community Support'
];

const projects = [
  {
    organization: 'BrightFuture Builders',
    title: 'Park Cleanup',
    description: 'Join us to clean up local parks and make them beautiful!',
    location: 'Riverside Park',
    date: '2026-10-10',
    categories: ['Environment', 'Community Support']
  },
  {
    organization: 'BrightFuture Builders',
    title: 'Community Garden Build',
    description: 'Build raised garden beds for the community garden.',
    location: 'Downtown Community Garden',
    date: '2026-11-14',
    categories: ['Environment', 'Food Security']
  },
  {
    organization: 'GreenHarvest Growers',
    title: 'Food Drive',
    description: 'Help collect and distribute food to those in need.',
    location: 'City Harvest Center',
    date: '2026-10-03',
    categories: ['Food Security', 'Community Support']
  },
  {
    organization: 'GreenHarvest Growers',
    title: 'Urban Farming Workshop',
    description: 'Learn sustainable urban farming techniques.',
    location: 'GreenHarvest Farm',
    date: '2026-11-21',
    categories: ['Environment', 'Education']
  },
  {
    organization: 'UnityServe Volunteers',
    title: 'Community Tutoring',
    description: 'Volunteer to tutor students in various subjects.',
    location: 'Central Library',
    date: '2026-10-17',
    categories: ['Education', 'Community Support']
  },
  {
    organization: 'UnityServe Volunteers',
    title: 'Senior Tech Assistance',
    description: 'Help seniors learn to use smartphones and computers.',
    location: 'Maple Community Center',
    date: '2026-12-05',
    categories: ['Education', 'Community Support']
  }
];

const createTables = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS public.organization (
      organization_id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      description TEXT NOT NULL,
      contact_email VARCHAR(255) NOT NULL,
      logo_filename VARCHAR(255) NOT NULL
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS public.category (
      category_id SERIAL PRIMARY KEY,
      category_name VARCHAR(150) NOT NULL
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS public.project (
      project_id SERIAL PRIMARY KEY,
      organization_id INT NOT NULL REFERENCES public.organization(organization_id),
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      location VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS public.project_category (
      project_id INT NOT NULL REFERENCES public.project(project_id),
      category_id INT NOT NULL REFERENCES public.category(category_id),
      PRIMARY KEY (project_id, category_id)
    );
  `);

  console.log('Tables ensured.');
};

const seedOrganizations = async () => {
  for (const org of organizations) {
    const exists = await db.query(
      `SELECT 1 FROM public.organization WHERE name = $1 LIMIT 1;`,
      [org.name]
    );

    if (exists.rows.length === 0) {
      await db.query(
        `INSERT INTO public.organization (name, description, contact_email, logo_filename)
         VALUES ($1, $2, $3, $4);`,
        [org.name, org.description, org.contact_email, org.logo_filename]
      );
    }
  }

  console.log('Organization seed completed.');
};

const seedCategories = async () => {
  for (const name of categories) {
    const exists = await db.query(
      `SELECT 1 FROM public.category WHERE category_name = $1 LIMIT 1;`,
      [name]
    );

    if (exists.rows.length === 0) {
      await db.query(
        `INSERT INTO public.category (category_name) VALUES ($1);`,
        [name]
      );
    }
  }

  console.log('Category seed completed.');
};

const seedProjects = async () => {
  for (const project of projects) {
    const orgResult = await db.query(
      `SELECT organization_id FROM public.organization WHERE name = $1 LIMIT 1;`,
      [project.organization]
    );

    if (orgResult.rows.length === 0) {
      console.warn(`Skipping project '${project.title}': organization '${project.organization}' not found.`);
      continue;
    }

    const organizationId = orgResult.rows[0].organization_id;

    let projectResult = await db.query(
      `SELECT project_id FROM public.project WHERE title = $1 AND organization_id = $2 LIMIT 1;`,
      [project.title, organizationId]
    );

    if (projectResult.rows.length === 0) {
      const insertResult = await db.query(
        `INSERT INTO public.project (organization_id, title, description, location, date)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING project_id;`,
        [organizationId, project.title, project.description, project.location, project.date]
      );
      projectResult = insertResult;
    }

    const projectId = projectResult.rows[0].project_id;

    for (const categoryName of project.categories) {
      const categoryResult = await db.query(
        `SELECT category_id FROM public.category WHERE category_name = $1 LIMIT 1;`,
        [categoryName]
      );

      if (categoryResult.rows.length === 0) {
        continue;
      }

      const categoryId = categoryResult.rows[0].category_id;

      const linkExists = await db.query(
        `SELECT 1 FROM public.project_category WHERE project_id = $1 AND category_id = $2 LIMIT 1;`,
        [projectId, categoryId]
      );

      if (linkExists.rows.length === 0) {
        await db.query(
          `INSERT INTO public.project_category (project_id, category_id) VALUES ($1, $2);`,
          [projectId, categoryId]
        );
      }
    }
  }

  console.log('Project seed completed.');
};

try {
  await createTables();
  await seedOrganizations();
  await seedCategories();
  await seedProjects();
  console.log('Database seed finished successfully.');
} catch (error) {
  console.error('Database seed failed:', error.message);
  process.exit(1);
} finally {
  await db.end();
}