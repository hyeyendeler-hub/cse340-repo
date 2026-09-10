DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS categories;

CREATE TABLE organizations (
  organization_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL
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

INSERT INTO organizations (name, description) VALUES
  ('Green Valley Collective', 'Focused on neighborhood sustainability, community gardens, and local environmental education.'),
  ('Northside Learning Center', 'Provides tutoring, mentoring, and family support to strengthen educational access.'),
  ('City Wellness Alliance', 'Promotes health awareness, screenings, and wellness initiatives for underserved populations.');

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