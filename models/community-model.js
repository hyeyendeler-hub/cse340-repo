const pool = require('../database');

async function getOrganizations() {
  const { rows } = await pool.query(
    `SELECT organization_id, name, description, image_one, image_two, image_three
     FROM organizations
     ORDER BY name`
  );
  return rows;
}

async function getProjects() {
  const { rows } = await pool.query(`
    SELECT
      p.project_id,
      p.name,
      p.description,
      o.name AS organization_name,
      c.name AS category_name
    FROM projects p
    JOIN organizations o ON o.organization_id = p.organization_id
    JOIN categories c ON c.category_id = p.category_id
    ORDER BY p.name
  `);
  return rows;
}

async function getCategories() {
  const { rows } = await pool.query(
    'SELECT category_id, name FROM categories ORDER BY name'
  );
  return rows;
}

module.exports = {
  getOrganizations,
  getProjects,
  getCategories
};