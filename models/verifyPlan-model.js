const pool = require("../config/mySQL-DB");

const verifyPlanModel = {
  verifyPlan: async (id) => {
    const connection = await pool.getConnection();
    try {
      let query = `SELECT plan FROM users WHERE id = '${id}'`;
      const [rows] = await connection.query(query);
      return rows;
    } catch (err) {
      // Handle errors here
      console.error(err);
      throw err;
    } finally {
      connection.release(); // Release the connection back to the pool
    }
  },
};

module.exports = verifyPlanModel;
