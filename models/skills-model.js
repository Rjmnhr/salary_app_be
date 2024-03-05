const pool = require("../config/mySQL-DB");

const SkillsModel = {
  getSkillsByRoles: async (getSkillsByRoles) => {
    const connection = await pool.getConnection();

    try {
      const query = `SELECT ${getSkillsByRoles.job_title} FROM price_a_job_skills_and_relevant_roles`;
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
  getTopSkills: async (getTopSkills) => {
    const connection = await pool.getConnection();

    try {
      const query = `SELECT ${getTopSkills.job_title} FROM price_a_job_topskills`;
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
