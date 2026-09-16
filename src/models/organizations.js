const db = require('./db');

const getAllOrganizations = async () => {
  const result = await db.query(`
    SELECT organization_id, name, description, image_one, image_two, image_three
    FROM organizations
    ORDER BY name
  `);

  return result.rows;
};

module.exports = { getAllOrganizations };