DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS categories;

CREATE TABLE organizations (
  organization_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  image_one VARCHAR(255) NOT NULL,
  image_two VARCHAR(255) NOT NULL,
  image_three VARCHAR(255) NOT NULL
);

CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE projects (
  project_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  organization_id INTEGER NOT NULL REFERENCES organizations(organization_id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(category_id) ON DELETE RESTRICT
);

INSERT INTO organizations (name, description, image_one, image_two, image_three) VALUES
  ('Green Valley Collective', 'Focused on neighborhood sustainability, community gardens, and local environmental education.', '/images/organizations/green-valley-garden.svg', '/images/organizations/green-valley-river.svg', '/images/organizations/green-valley-workshop.svg'),
  ('Northside Learning Center', 'Provides tutoring, mentoring, and family support to strengthen educational access.', '/images/organizations/northside-reading.svg', '/images/organizations/northside-mentoring.svg', '/images/organizations/northside-lab.svg'),
  ('City Wellness Alliance', 'Promotes health awareness, screenings, and wellness initiatives for underserved populations.', '/images/organizations/city-wellness-screening.svg', '/images/organizations/city-wellness-yoga.svg', '/images/organizations/city-wellness-community.svg');

INSERT INTO categories (name) VALUES
  ('Education'),
  ('Health'),
  ('Environment'),
  ('Community');

INSERT INTO projects (name, description, organization_id, category_id) VALUES
  ('River Cleanup Drive', 'Volunteers and local partners are restoring a public riverfront through cleanups and education.', 1, 3),
  ('Community Garden Network', 'Neighbors are turning unused spaces into gardens that support local food access.', 1, 3),
  ('After-School Mentor Network', 'A cross-community effort connecting students with trained mentors for academic support.', 2, 1),
  ('Family Learning Lab', 'Free workshops help families build practical learning routines at home.', 2, 1),
  ('Community Food Exchange', 'Residents share resources, reduce waste, and improve access to healthy food options.', 3, 4),
  ('Wellness Screening Days', 'Local health partners provide accessible screenings and wellness information.', 3, 2);


  -- projects for the "Community" category
  INSERT INTO categories (name) VALUES
  ('Housing'),
  ('Food Security'),
  ('Arts and Culture'),
  ('Youth Development');