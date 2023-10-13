const pool = require("../mySQL-DB");

const SalaryModel = {
  getAll: async (getAll) => {
    const connection = await pool.getConnection();

    try {
      const userInputSkills = getAll.skills;
      let conditions = "";
      if (userInputSkills && userInputSkills.length > 0) {
        conditions = userInputSkills
          .map((skill) => `FIND_IN_SET('${skill}', combined_skills) > 0`)
          .join(" OR ");
        conditions = `(${conditions}) AND`;
      }

      let experienceQuery = "";
      if (getAll.experience) {
        experienceQuery = `AND
          CAST(SUBSTRING_INDEX(experience, '-', 1) AS UNSIGNED) <= ${getAll.experience}
          AND
          CAST(SUBSTRING_INDEX(experience, '-', -1) AS UNSIGNED) >= ${getAll.experience} `;
      }

      const query = `SELECT mapped_job_title, mapped_job_title_1, current_date, salary, mapped_average_sal, avg_experience, combined_skills
        FROM naukri_extract
        WHERE ${conditions} mapped_job_title = '${getAll.job_title}' AND location LIKE '%${getAll.location}%'
        ${experienceQuery} AND mapped_average_sal > 2`;

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
  getByRole: async (getByRole) => {
    const connection = await pool.getConnection();

    try {
      const query = `SELECT mapped_job_title, mapped_job_title_1, current_date, salary, mapped_average_sal, avg_experience, combined_skills
        FROM naukri_extract
        WHERE  mapped_job_title = '${getByRole.job_title}'   AND mapped_average_sal >= 2`;

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
