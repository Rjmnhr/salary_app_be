const pool = require("../mySQL-DB");

const SalaryModel = {
  saveReports: async (saveReports) => {
    const connection = await pool.getConnection();

    try {
      const query = `INSERT INTO reports_data (user_id, job_titles, experience, skills, location, manage, supervise, sector)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      const [rows] = await connection.query(query, [
        saveReports.user_id,
        saveReports.job_titles,
        saveReports.experience ? saveReports.experience : null,

        saveReports.skills,
        saveReports.location,
        saveReports.manage,

        saveReports.supervise,
        saveReports.sector,
      ]);

      return rows;
    } catch (err) {
      // Handle errors here
      console.error(err);
      throw err;
    } finally {
      connection.release(); // Release the connection back to the pool
    }
  },
  getReportByID: async (getReportByID) => {
    const connection = await pool.getConnection();

    try {
      const query = `SELECT  
      job_titles,
      location,
      experience,
      skills,
      manage,
      supervise
      sector
      FROM reports_data WHERE user_id = ${getReportByID.user_id}`;

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
