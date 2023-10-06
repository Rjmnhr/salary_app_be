const pool = require("../mySQL-DB");

const SalaryModel = {
  getAll: async (getAll) => {
    const connection = await pool.getConnection();

    try {
      // User input array of skills
      const userInputSkills = getAll.skills;

      const conditions = userInputSkills
        .map((skill) => `FIND_IN_SET('${skill}', combined_skills) > 0`)
        .join(" OR ");
      const query = `SELECT mapped_job_title, mapped_job_title_1, current_date, salary,  mapped_average_sal, avg_experience  FROM naukri_extract WHERE (${conditions}) AND mapped_job_title= '${getAll.job_title}' AND location LIKE '%${getAll.location}%' `;

      const [rows] = await connection.query(query);

      const rowsCheck = rows;

      if (rowsCheck.length > 0) {
        return rows;
      } else {
        const query = `SELECT mapped_job_title,mapped_job_title_1, current_date, salary,  mapped_average_sal, avg_experience  FROM naukri_extract WHERE mapped_job_title= '${getAll.job_title}' AND location LIKE '%${getAll.location}%' `;
        const [rows] = await connection.query(query);

        return rows;
      }
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
