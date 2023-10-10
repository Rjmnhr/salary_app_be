const pool = require("../mySQL-DB");

const SkillsModel = {
  getSkillsByRoles: async (getSkillsByRoles) => {
    const connection = await pool.getConnection();

    try {
      const query = `SELECT ${getSkillsByRoles.job_title} FROM skills_and_relevant_roles`;
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

module.exports = SkillsModel;
