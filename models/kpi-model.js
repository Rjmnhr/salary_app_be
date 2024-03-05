const pool = require("../config/mySQL-DB");

const KPIModel = {
  getSectors: async (getSectors) => {
    const connection = await pool.getConnection();

    try {
      const query = `Select distinct sector from individual_KPI`;

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
  getRoles: async (getRoles) => {
    const connection = await pool.getConnection();

    try {
      const query = `Select distinct kmp from individual_KPI`;

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
  getReport: async (getReport) => {
    const connection = await pool.getConnection();

    try {
      let listOfSectors = getReport.sectors.split(",");
      const placeholders = listOfSectors.map(() => "?").join(",");

      const query = `SELECT Individual_kpis , sector, weighting FROM individual_KPI
      
      WHERE kmp = ? AND sector IN (${placeholders});`;

      // Combine query and parameters for logging
      const loggableQuery = connection.format(query, [
        getReport.role,
        ...listOfSectors,
      ]);

      const [rows] = await connection.query(query, [
        getReport.role,
        ...listOfSectors,
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

module.exports = KPIModel;
