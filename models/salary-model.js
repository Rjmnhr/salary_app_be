const pool = require("../mySQL-DB");
const NodeCache = require("node-cache");

const skillsCache = new NodeCache();

const SalaryModel = {
  getAllRoles: async (getAllRoles) => {
    const connection = await pool.getConnection();

    try {
      const query = `SELECT distinct mapped_job_title FROM naukri_extract`;

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
  getAll: async (getAll) => {
    const connection = await pool.getConnection();

    try {
      const userInputSkills = getAll.skills;
      let conditions = "";
      if (userInputSkills && userInputSkills.length > 0) {
        conditions = userInputSkills
          .map(
            (skill) =>
              `FIND_IN_SET('${skill?.toLowerCase()}', combined_skills) > 0`
          )
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

      const query = `SELECT experience, mapped_job_title, mapped_job_title_1, current_date, salary, mapped_average_sal, avg_experience, combined_skills
        FROM naukri_extract
        WHERE ${conditions} mapped_job_title = '${getAll.job_title}' AND location LIKE '%${getAll.location}%'
        ${experienceQuery} AND mapped_average_sal > 2`;

      const [rows] = await connection.query(query);

      const rowsCheck = rows;

      if (rowsCheck.length > 1) {
        skillsCache.set("key", true);
        let bool = "";
        if (userInputSkills && userInputSkills.length > 0) {
          bool = true;
        } else {
          bool = null;
        }

        return { rows: rows, bool: bool };
      } else {
        skillsCache.set("key", false);

        const query = `SELECT experience, mapped_job_title, mapped_job_title_1, current_date, salary, mapped_average_sal, avg_experience, combined_skills
        FROM naukri_extract
        WHERE  mapped_job_title = '${getAll.job_title}' AND location LIKE '%${getAll.location}%'
        ${experienceQuery} AND mapped_average_sal > 2 `;
        const [rows] = await connection.query(query);
        const bool = false;
        return { rows: rows, bool: bool };
      }
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
      const storeSkillCache = skillsCache.get("key");
      const userInputSkills = getByRole.skills;
      let conditions = "";
      if (userInputSkills && userInputSkills.length > 0 && storeSkillCache) {
        conditions = userInputSkills
          .map(
            (skill) =>
              `FIND_IN_SET('${skill?.toLowerCase()}', combined_skills) > 0`
          )
          .join(" OR ");
        conditions = `(${conditions}) AND`;
      }

      let experienceQuery = "";
      if (getByRole.experience) {
        experienceQuery = `AND
          CAST(SUBSTRING_INDEX(experience, '-', 1) AS UNSIGNED) <= ${getByRole.experience}
          AND
          CAST(SUBSTRING_INDEX(experience, '-', -1) AS UNSIGNED) >= ${getByRole.experience} `;
      }

      const query = `SELECT experience, mapped_job_title, mapped_job_title_1, current_date, salary, mapped_average_sal, avg_experience, combined_skills
        FROM naukri_extract
        WHERE  ${conditions} mapped_job_title = '${getByRole.job_title}'  ${experienceQuery}  AND mapped_average_sal >= 2`;

      const [rows] = await connection.query(query);

      const rowsCheck = rows;

      if (rowsCheck.length > 1) {
        return rows;
      } else {
        const query = `SELECT experience, mapped_job_title, mapped_job_title_1, current_date, salary, mapped_average_sal, avg_experience, combined_skills
        FROM naukri_extract
        WHERE mapped_job_title = '${getByRole.job_title}'  ${experienceQuery} AND mapped_average_sal >= 2`;
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
  getByRoleNoExperience: async (getByRoleNoExperience) => {
    const connection = await pool.getConnection();

    try {
      const storeSkillCache = skillsCache.get("key");
      const userInputSkills = getByRoleNoExperience.skills;
      let conditions = "";
      if (userInputSkills && userInputSkills.length > 0 && storeSkillCache) {
        conditions = userInputSkills
          .map(
            (skill) =>
              `FIND_IN_SET('${skill?.toLowerCase()}', combined_skills) > 0`
          )
          .join(" OR ");
        conditions = `(${conditions}) AND`;
      }

      const query = `SELECT experience, mapped_job_title, mapped_job_title_1, current_date, salary, mapped_average_sal, avg_experience, combined_skills
        FROM naukri_extract
        WHERE  ${conditions} mapped_job_title = '${getByRoleNoExperience.job_title}'   AND mapped_average_sal >= 2 `;

      const [rows] = await connection.query(query);

      const rowsCheck = rows;

      if (rowsCheck.length > 1) {
        return rows;
      } else {
        const query = `SELECT experience, mapped_job_title, mapped_job_title_1, current_date, salary, mapped_average_sal, avg_experience, combined_skills
        FROM naukri_extract
        WHERE mapped_job_title = '${getByRoleNoExperience.job_title}' AND mapped_average_sal >= 2`;
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
