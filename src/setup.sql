-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Sample Data
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename) VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Category Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(150) NOT NULL
);

-- ========================================
-- Project Table
-- ========================================
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL REFERENCES organization(organization_id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL
);

-- ========================================
-- Project-Category Junction Table
-- ========================================
CREATE TABLE project_category (
    project_id INT NOT NULL REFERENCES project(project_id),
    category_id INT NOT NULL REFERENCES category(category_id),
    PRIMARY KEY (project_id, category_id)
);

-- ========================================
-- Sample Data: Categories
-- ========================================
INSERT INTO category (category_name) VALUES
('Environment'),
('Food Security'),
('Education'),
('Community Support');

-- ========================================
-- Sample Data: Projects
-- ========================================
INSERT INTO project (organization_id, title, description, location, date) VALUES
(1, 'Park Cleanup', 'Join us to clean up local parks and make them beautiful!', 'Riverside Park', '2026-10-10'),
(1, 'Community Garden Build', 'Build raised garden beds for the community garden.', 'Downtown Community Garden', '2026-11-14'),
(2, 'Food Drive', 'Help collect and distribute food to those in need.', 'City Harvest Center', '2026-10-03'),
(2, 'Urban Farming Workshop', 'Learn sustainable urban farming techniques.', 'GreenHarvest Farm', '2026-11-21'),
(3, 'Community Tutoring', 'Volunteer to tutor students in various subjects.', 'Central Library', '2026-10-17'),
(3, 'Senior Tech Assistance', 'Help seniors learn to use smartphones and computers.', 'Maple Community Center', '2026-12-05');

-- ========================================
-- Sample Data: Project Categories
-- ========================================
INSERT INTO project_category (project_id, category_id) VALUES
(1, 1), (1, 4),
(2, 1), (2, 2),
(3, 2), (3, 4),
(4, 1), (4, 3),
(5, 3), (5, 4),
(6, 3), (6, 4);