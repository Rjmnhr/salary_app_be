const pool = require("../mySQL-DB");

const BenchmarkModel = {
  getData: async (getData) => {
    const connection = await pool.getConnection();

    try {
      let listOfCompanies = getData.companies.split(",");
      const placeholders = listOfCompanies.map(() => "?").join(",");

      const query = `SELECT salary, directors_sitting_fees FROM benchmark WHERE designation_category = ? AND company_name IN (${placeholders})`;

      // Combine query and parameters for logging
      const loggableQuery = connection.format(query, [
        getData.role,
        ...listOfCompanies,
      ]);

      const [rows] = await connection.query(query, [
        getData.role,
        ...listOfCompanies,
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
  getCompaniesByHandSelect: async (getCompaniesByHandSelect) => {
    const connection = await pool.getConnection();

    let listOfIndustries = getCompaniesByHandSelect.industries.split(",");

    try {
      const query = `SELECT company_name
      FROM benchmark
      WHERE  industry_group IN (?) AND  ((market_capitalisation_2022 BETWEEN ${getCompaniesByHandSelect.minMarketCap} AND ${getCompaniesByHandSelect.maxMarketCap})
         OR (total_assets_2022 BETWEEN ${getCompaniesByHandSelect.minAssets} AND ${getCompaniesByHandSelect.maxAssets})
         OR (sales_2022 BETWEEN  ${getCompaniesByHandSelect.minSales} AND ${getCompaniesByHandSelect.maxSales})
         OR (PAT_2022 BETWEEN  ${getCompaniesByHandSelect.minPAT} AND ${getCompaniesByHandSelect.maxPAT}))
        `;

      const [rows] = await connection.query(query, [listOfIndustries]);
      return rows;
    } catch (err) {
      // Handle errors here
      console.error(err);
      throw err;
    } finally {
      connection.release(); // Release the connection back to the pool
    }
  },
  getCompaniesByIndex: async (getCompaniesByIndex) => {
    const connection = await pool.getConnection();

    let listOfIndustries = getCompaniesByIndex.industries.split(",");

    try {
      const query = `SELECT company_name
      FROM benchmark
      WHERE  industry_group IN (?) AND ${getCompaniesByIndex.index} = 1;
        `;
      const loggableQuery = connection.format(query, [listOfIndustries]);
      console.log(
        "🚀 ~ file: benchmark-model.js:83 ~ getCompaniesByIndex: ~ loggableQuery:",
        loggableQuery
      );

      const [rows] = await connection.query(query, [listOfIndustries]);
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
