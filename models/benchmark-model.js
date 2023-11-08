const pool = require("../mySQL-DB");

const BenchmarkModel = {
  getIndustries: async (getIndustries) => {
    const connection = await pool.getConnection();

    try {
      const query = `select industry_group from benchmark`;

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
  getCompanies: async (getCompanies) => {
    const connection = await pool.getConnection();

    let listOfIndustries = getCompanies.industries.join("','");

    try {
      const query = `SELECT company_name
      FROM benchmark
      WHERE market_capitalisation_2022 BETWEEN ${getCompanies.minMarketCap} AND ${getCompanies.maxMarketCap}
         OR total_assets_2022 BETWEEN ${getCompanies.minAssets} AND ${getCompanies.maxAssets}
         OR sales_2022 ${getCompanies.minSales} AND ${getCompanies.maxSales}
         OR PAT_2022 ${getCompanies.minPAT} AND ${getCompanies.maxPAT}
         AND industry_group IN ('${listOfIndustries}')`;

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

module.exports = BenchmarkModel;
