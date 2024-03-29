const pool = require("../config/mySQL-DB");

const TrackedData = {
  saveTrackedData3: async (saveTrackedData3) => {
    const connection = await pool.getConnection();

    try {
      const query = `
    
      INSERT INTO tracking_data_3 (user_id,path,ip_address)
      VALUES (?,?, ?)
    `;

      const [rows] = await connection.query(query, [
        saveTrackedData3.id,
        saveTrackedData3.path, // Add the path here
        saveTrackedData3.ipAddress, // Add the IP address here
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
  saveTrackedData2: async (saveTrackedData2) => {
    const path = saveTrackedData2?.path?.pathname;
    const connection = await pool.getConnection();

    try {
      const query = `
    
      INSERT INTO tracking_data_2 (user_id,path,ip_address,time )
      VALUES (${saveTrackedData2.id},'${path}', '${saveTrackedData2.ipAddress}',${saveTrackedData2.timeSpent})
    `;


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

module.exports = TrackedData;
