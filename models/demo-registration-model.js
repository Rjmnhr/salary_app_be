const pool = require("../config/mySQL-DB");

const DemoModel = {
  saveRegistration: async (saveRegistration, id) => {
    const connection = await pool.getConnection();

    try {
      const query = `INSERT INTO DemoRegistration (first_name, last_name, email, phone, title, organization, industry, registration_date ,registration_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`;

      const [rows] = await connection.query(query, [
        saveRegistration.first_name,
        saveRegistration.last_name,
        saveRegistration.email,
        saveRegistration.phone,
        saveRegistration.title,
        saveRegistration.organization,
        saveRegistration.industry,
        saveRegistration.date,
        saveRegistration.time,
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
};

module.exports = DemoModel;
