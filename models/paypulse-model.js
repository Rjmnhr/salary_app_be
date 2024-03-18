const pool = require("../config/mySQL-DB");
const NodeCache = require("node-cache");

const skillsCache = new NodeCache();

const PriceAJobModel = {
  getAllTitles: async () => {
    const connection = await pool.getConnection();

    try {
      const query = `SELECT id, titles FROM paypulse_titles where id != 0`;

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
      const query = `SELECT
      distinct p.industry_type
      FROM paypulse_titles AS t
      LEFT JOIN
      paypulse_profiles AS p ON t.id = p.title_id
      where t.id = '${getAllSectors.title_id}' AND p.industry_type is not null;`;

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
  getValidInputs: async (getValidInputs) => {
    const connection = await pool.getConnection();

    try {
      const query = `SELECT
      p.location , p.experience , p.industry_type as sectors
      FROM paypulse_titles AS t
      LEFT JOIN
      paypulse_profiles AS p ON t.id = p.title_id
      WHERE 
      t.id = '${getValidInputs.title_id}';`;

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
      const query = `SELECT
      distinct s.skill
      FROM paypulse_titles AS t
      LEFT JOIN
      paypulse_topskills AS s ON t.id = s.title_id
      where t.id = '${getTopSkills.title_id}'`;

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
  getRelevantSkills: async (getRelevantSkills) => {
    const connection = await pool.getConnection();

    try {
      const query = `SELECT
      distinct s.skill
      FROM paypulse_titles AS t
      LEFT JOIN
      paypulse_relevant_skills AS s ON t.id = s.title_id
      where t.id = '${getRelevantSkills.title_id}'`;

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
              `FIND_IN_SET('${skill?.toLowerCase()}', p.combined_skills) > 0`
          )
          .join(" OR ");
        conditions = `(${conditions}) AND`;
      }

      let experienceQuery = "";
      if (salaryData.experience) {
        experienceQuery = `AND p.experience = '${salaryData.experience}' `;
      }

      let sectorQuery = "";
      if (salaryData.sector) {
        sectorQuery = `AND p.industry_type = '${salaryData.sector}' `;
      }

      const query = `SELECT
      p.experience, p.mapped_job_title as title, p.extracted_on as posted_date, p.mapped_average_sal as salary, p.combined_skills , p.salmax
      FROM paypulse_titles AS t
      LEFT JOIN
      paypulse_profiles AS p ON t.id = p.title_id
      WHERE ${conditions} t.id = '${salaryData.title_id}' AND location LIKE '%${salaryData.location}%'
      ${experienceQuery} ${sectorQuery} AND mapped_average_sal > 2 ;`;

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

        const query = `SELECT
        p.experience, p.mapped_job_title as title, p.extracted_on as posted_date, p.mapped_average_sal as salary, p.combined_skills , p.salmax
        FROM paypulse_titles AS t
        LEFT JOIN
        paypulse_profiles AS p ON t.id = p.title_id
        WHERE t.id = '${salaryData.title_id}' AND location LIKE '%${salaryData.location}%'
        ${experienceQuery} ${sectorQuery} AND mapped_average_sal > 2 ; `;

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
              `FIND_IN_SET('${skill?.toLowerCase()}', p.combined_skills) > 0`
          )
          .join(" OR ");
        conditions = `(${conditions}) AND`;
      }

      let experienceQuery = "";
      if (salaryDataWithoutLoc.experience) {
        experienceQuery = `AND p.experience = '${salaryDataWithoutLoc.experience}' `;
      }

      let sectorQuery = "";
      if (salaryDataWithoutLoc.sector) {
        sectorQuery = `AND p.industry_type = '${salaryDataWithoutLoc.sector}' `;
      }
      const query = `SELECT
      p.experience, p.mapped_job_title as title, p.extracted_on as posted_date, p.mapped_average_sal as salary, p.combined_skills , p.salmax
      FROM paypulse_titles AS t
      LEFT JOIN
      paypulse_profiles AS p ON t.id = p.title_id
      WHERE ${conditions} t.id = '${salaryDataWithoutLoc.title_id}' 
      ${experienceQuery} ${sectorQuery} AND mapped_average_sal >= 2 ;`;

      const [rows] = await connection.query(query);

      const rowsCheck = rows;

      if (rowsCheck.length > threshold) {
        return rows;
      } else {
        const query = `SELECT
        p.experience, p.mapped_job_title as title, p.extracted_on as posted_date, p.mapped_average_sal as salary, p.combined_skills , p.salmax
        FROM paypulse_titles AS t
        LEFT JOIN
        paypulse_profiles AS p ON t.id = p.title_id
        WHERE t.id = '${salaryDataWithoutLoc.title_id}' 
        ${experienceQuery} ${sectorQuery} AND mapped_average_sal >= 2 ;`;
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
              `FIND_IN_SET('${skill?.toLowerCase()}', p.combined_skills) > 0`
          )
          .join(" OR ");
        conditions = `(${conditions}) AND`;
      }

      let sectorQuery = "";
      if (salaryDataWithoutExp.sector) {
        sectorQuery = `AND p.industry_type = '${salaryDataWithoutExp.sector}' `;
      }

      const query = `SELECT
      p.experience, p.mapped_job_title as title, p.extracted_on as posted_date, p.mapped_average_sal as salary, p.combined_skills , p.salmax
      FROM paypulse_titles AS t
      LEFT JOIN
      paypulse_profiles AS p ON t.id = p.title_id
      WHERE ${conditions} t.id = '${salaryDataWithoutExp.title_id}'  AND location LIKE '%${salaryDataWithoutExp.location}%'
     ${sectorQuery} AND mapped_average_sal >= 2 ;`;

      const [rows] = await connection.query(query);

      const rowsCheck = rows;

      if (rowsCheck.length > threshold) {
        return rows;
      } else {
        const query = `SELECT
        p.experience, p.mapped_job_title as title, p.extracted_on as posted_date, p.mapped_average_sal as salary, p.combined_skills , p.salmax
        FROM paypulse_titles AS t
        LEFT JOIN
        paypulse_profiles AS p ON t.id = p.title_id
        WHERE t.id = '${salaryDataWithoutExp.title_id}'  AND location LIKE '%${salaryDataWithoutExp.location}%'
       ${sectorQuery} AND mapped_average_sal >= 2 ;`;

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

module.exports = PriceAJobModel;
