const pool = require("../config/mySQL-DB");
const NodeCache = require("node-cache");

const skillsCache = new NodeCache();

const SalaryModel = {
  getAllTitles: async (getAllTitles) => {
    const connection = await pool.getConnection();

    try {
      const query = `SELECT distinct mapped_job_title FROM price_a_job`;

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
  getAllSectors: async (getAllSectors) => {
    const connection = await pool.getConnection();

    try {
      const query = `SELECT distinct industry_type FROM price_a_job where mapped_job_title = '${getAllSectors.title}' `;

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
  salaryData: async (salaryData) => {
    const connection = await pool.getConnection();

    const threshold = salaryData.threshold;

    try {
      const userInputSkills = salaryData.skills;
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
      if (salaryData.experience) {
        experienceQuery = `AND experience = '${salaryData.experience}' `;
      }

      let sectorQuery = "";
      if (salaryData.sector) {
        sectorQuery = `AND industry_type = '${salaryData.sector}' `;
      }

      const query = `SELECT experience, mapped_job_title, mapped_job_title_1, current_date, salary, mapped_average_sal, avg_experience, combined_skills
        FROM price_a_job
        WHERE ${conditions} mapped_job_title = '${salaryData.job_title}' AND location LIKE '%${salaryData.location}%'
        ${experienceQuery} ${sectorQuery} AND mapped_average_sal > 2`;

      const [rows] = await connection.query(query);

      const rowsCheck = rows;

      if (rowsCheck.length > threshold) {
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
        FROM price_a_job
        WHERE  mapped_job_title = '${salaryData.job_title}' AND location LIKE '%${salaryData.location}%'
        ${experienceQuery} ${sectorQuery} AND mapped_average_sal > 2 `;
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
  salaryDataWithoutLoc: async (salaryDataWithoutLoc) => {
    const connection = await pool.getConnection();
    const threshold = salaryDataWithoutLoc.threshold;
    try {
      const storeSkillCache = skillsCache.get("key");
      const userInputSkills = salaryDataWithoutLoc.skills;
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
      if (salaryDataWithoutLoc.experience) {
        experienceQuery = `AND experience = '${salaryDataWithoutLoc.experience}' `;
      }

      let sectorQuery = "";
      if (salaryDataWithoutLoc.sector) {
        sectorQuery = `AND industry_type = '${salaryDataWithoutLoc.sector}' `;
      }
      const query = `SELECT experience, mapped_job_title, mapped_job_title_1, current_date, salary, mapped_average_sal, avg_experience, combined_skills
        FROM price_a_job
        WHERE  ${conditions} mapped_job_title = '${salaryDataWithoutLoc.job_title}'  ${experienceQuery}  ${sectorQuery} AND mapped_average_sal >= 2`;

      const [rows] = await connection.query(query);

      const rowsCheck = rows;

      if (rowsCheck.length > threshold) {
        return rows;
      } else {
        const query = `SELECT experience, mapped_job_title, mapped_job_title_1, current_date, salary, mapped_average_sal, avg_experience, combined_skills
        FROM price_a_job
        WHERE mapped_job_title = '${salaryDataWithoutLoc.job_title}'  ${experienceQuery} ${sectorQuery} AND mapped_average_sal >= 2`;
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
  salaryDataWithoutExp: async (salaryDataWithoutExp) => {
    const connection = await pool.getConnection();
    const threshold = salaryDataWithoutExp.threshold;
    try {
      const storeSkillCache = skillsCache.get("key");
      const userInputSkills = salaryDataWithoutExp.skills;
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

      let sectorQuery = "";
      if (salaryDataWithoutExp.sector) {
        sectorQuery = `AND industry_type = '${salaryDataWithoutExp.sector}' `;
      }

      const query = `SELECT experience, mapped_job_title, mapped_job_title_1, current_date, salary, mapped_average_sal, avg_experience, combined_skills
        FROM price_a_job
        WHERE  ${conditions} mapped_job_title = '${salaryDataWithoutExp.job_title}' ${sectorQuery}  AND mapped_average_sal >= 2 `;

      const [rows] = await connection.query(query);

      const rowsCheck = rows;

      if (rowsCheck.length > threshold) {
        return rows;
      } else {
        const query = `SELECT experience, mapped_job_title, mapped_job_title_1, current_date, salary, mapped_average_sal, avg_experience, combined_skills
        FROM price_a_job
        WHERE mapped_job_title = '${salaryDataWithoutExp.job_title}' ${sectorQuery} AND mapped_average_sal >= 2`;

        console.log("🚀 ~ salaryDataWithoutExp: ~ query:", query);

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
