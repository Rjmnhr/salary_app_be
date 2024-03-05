const pool = require("../config/mySQL-DB");

const SalaryModel = {
  saveReports: async (saveReports, id) => {
    const connection = await pool.getConnection();

    try {
      const query = `INSERT INTO price_a_job_reports (user_id, job_titles, experience, skills, location, manage, supervise, sector)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      const [rows] = await connection.query(query, [
        id,
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
  getReportByID: async (id) => {
    const connection = await pool.getConnection();

    try {
      const query = `SELECT  
      report_id,
      job_titles,
      location,
      experience,
      skills,
      manage,
      supervise,
      sector
      FROM price_a_job_reports WHERE user_id = ${id}`;

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

  updateReport: async (updateReport) => {
    const connection = await pool.getConnection();

    try {
      const query = `UPDATE price_a_job_reports
      SET experience = '${updateReport.experience}',
      skills = '${updateReport.skills}',
      location = '${updateReport.location}',
      sector = '${updateReport.sector}'
      WHERE report_id = '${updateReport.id}' ;`;

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
