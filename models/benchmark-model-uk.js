const pool = require("../config/mySQL-DB");

const BenchmarkModel = {
  getCompaniesByHandSelect: async (getCompaniesByHandSelect) => {
    const connection = await pool.getConnection();

    // Function to replace NaN, null, or undefined with zero
    const replace = (value) => {
      return isNaN(value) || value === null || value === undefined ? 0 : value;
    };

    // Build conditions based on provided attributes
    const conditions = [];

    if (
      replace(getCompaniesByHandSelect.maxMarketCap) !== "0" &&
      replace(getCompaniesByHandSelect.maxMarketCap) !== 0
    ) {
      conditions.push(
        `(market_capitalisation_2023 BETWEEN ${replace(
          getCompaniesByHandSelect.minMarketCap
        )} AND ${replace(getCompaniesByHandSelect.maxMarketCap)})`
      );
    }

    if (
      replace(getCompaniesByHandSelect.maxAssets) !== "0" &&
      replace(getCompaniesByHandSelect.maxAssets) !== 0
    ) {
      conditions.push(
        `(total_assets_2023 BETWEEN ${replace(
          getCompaniesByHandSelect.minAssets
        )} AND ${replace(getCompaniesByHandSelect.maxAssets)})`
      );
    }

    if (
      replace(getCompaniesByHandSelect.maxSales) !== "0" &&
      replace(getCompaniesByHandSelect.maxSales) !== 0
    ) {
      conditions.push(
        `(sales_2023 BETWEEN ${replace(
          getCompaniesByHandSelect.minSales
        )} AND ${replace(getCompaniesByHandSelect.maxSales)})`
      );
    }

    if (
      replace(getCompaniesByHandSelect.maxPAT) !== "0" &&
      replace(getCompaniesByHandSelect.maxPAT) !== 0
    ) {
      conditions.push(
        `(PAT_2023 BETWEEN ${replace(
          getCompaniesByHandSelect.minPAT
        )} AND ${replace(getCompaniesByHandSelect.maxPAT)})`
      );
    }

    try {
      let query = `
            SELECT distinct company_name, nse_symbol  
            FROM benchmark_2023
            WHERE ${industryGroupFilter}`;

      if (industries && conditions.length > 0) {
        query += `AND `;
      }

      // Add conditions only if there are any
      if (conditions.length > 0) {
        query += `( ${conditions.join(" OR ")})`;
      }

      const loggableQuery = connection.format(query, [listOfIndustries]);

      const [rows] = await connection.query(query, [listOfIndustries]);
      return rows;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      connection.release();
    }
  },
};

module.exports = BenchmarkModel;
