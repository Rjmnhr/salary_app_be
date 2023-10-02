const pool = require("../mySQL-DB");

const SalaryModel = {
  getAll: async () => {
    const connection = await pool.getConnection();

    try {
      const query = `SELECT mapped_job_title, salary, skill1, skill2, skill3, skill4 ,skill5, skill6, skill7, skill8, mapped_average_sal, "avg experience", comp_industry  FROM naukri_extract `;

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

module.exports = SalaryModel;
