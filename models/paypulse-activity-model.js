const pool = require("../config/mySQL-DB");

const PriceAJobActivityModel = {
  saveUserActivity: async (saveUserActivity, id) => {
    const connection = await pool.getConnection();

    try {
      const query = `INSERT INTO UserActivityPaypulse (report_id, user_id, title, experience, skills, location, manage, supervise, sector ,title_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?)`;

      const [rows] = await connection.query(query, [
        saveUserActivity.report_id,
        id,
        saveUserActivity.title,
        saveUserActivity.experience ? saveUserActivity.experience : null,

        saveUserActivity.skills,
        saveUserActivity.location,
        saveUserActivity.manage,

        saveUserActivity.supervise,
        saveUserActivity.sector,
        saveUserActivity.title_id,
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
  getUserActivity: async (id) => {
    const connection = await pool.getConnection();

    try {
      const query = `SELECT  
      report_id,
      title_id,
      title as title,
      location,
      experience,
      skills,
      manage,
      supervise,
      sector
      FROM UserActivityPaypulse WHERE user_id = ${id}`;

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

  updateUserActivity: async (updateUserActivity) => {
    const connection = await pool.getConnection();

    try {
      const query = `UPDATE UserActivityPaypulse
      SET experience = '${updateUserActivity.experience}',
      skills = '${updateUserActivity.skills}',
      location = '${updateUserActivity.location}',
      sector = '${updateUserActivity.sector}'
      WHERE report_id = '${updateUserActivity.id}' ;`;

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

module.exports = PriceAJobActivityModel;
