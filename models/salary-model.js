const pool = require("../mySQL-DB");

const SalaryModel = {
  getAll: async (getAll) => {
    const connection = await pool.getConnection();

    try {
      const query = `SELECT mapped_job_title, salary,  mapped_average_sal, avg_experience  FROM naukri_extract where mapped_job_title= '${getAll.job_title}' AND location LIKE '%${getAll.location}%' `;

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
