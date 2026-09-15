const db = require('./db');

async function getOrganizations() {
  const result = await db.query(`
    SELECT organization_id, name, description, image_one, image_two, image_three
    FROM organizations
    ORDER BY name
  `);
  return result.rows;
}

async function getProjects() {
  const result = await db.query(`
    SELECT
      projects.project_id,
      projects.name,
      projects.description,
      organizations.name AS organization_name,
      categories.name AS category_name
    FROM projects
    JOIN organizations ON organizations.organization_id = projects.organization_id
    JOIN categories ON categories.category_id = projects.category_id
    ORDER BY projects.name
  `);
  return result.rows;
}

module.exports = {
  getOrganizations,
  getProjects
};
