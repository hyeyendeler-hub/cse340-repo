const db = require("./db");

async function getCategories() {
  const result = await db.query(
    "SELECT category_id, name FROM categories ORDER BY name"
  );

  return result.rows;
}

async function getCategoryById(categoryId) {
  const result = await db.query(
    "SELECT category_id, name FROM categories WHERE category_id = $1",
    [categoryId]
  );

  return result.rows[0];
}

module.exports = {
  getCategories,
  getCategoryById,
};
