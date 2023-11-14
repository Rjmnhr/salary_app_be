const pool = require("../mySQL-DB");

const BenchmarkModel = {
  getData: async (getData) => {
    const connection = await pool.getConnection();

    try {
      let listOfCompanies = getData.companies.split(",");
      const placeholders = listOfCompanies.map(() => "?").join(",");

      const query = `SELECT salary, directors_sitting_fees, date, market_capitalisation_2022, total_assets_2022, sales_2022, PAT_2022 FROM benchmark WHERE designation_category = ? AND company_name IN (${placeholders})`;

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
  getData2021: async (getData2021) => {
    const connection = await pool.getConnection();

    try {
      let listOfCompanies = getData2021.companies.split(",");
      let listOfSymbols = getData2021.symbols.split(",");
      const placeholdersForCompany = listOfCompanies.map(() => "?").join(",");
      const placeholdersForSymbols = listOfSymbols.map(() => "?").join(",");

      const query = `SELECT salary FROM companies_2021 WHERE designation_category = ? AND (company_name IN (${placeholdersForCompany}) OR nse_symbol IN (${placeholdersForSymbols}) )`;

      // Combine query and parameters for logging
      const loggableQuery = connection.format(query, [
        getData2021.role,
        ...listOfCompanies,
        ...listOfSymbols,
      ]);

      const [rows] = await connection.query(query, [
        getData2021.role,
        ...listOfCompanies,
        ...listOfSymbols,
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
  getDistinctCompanies: async (getDistinctCompanies) => {
    const connection = await pool.getConnection();

    try {
      const query = `Select distinct company_name from benchmark`;

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
  getSectors: async (getSectors) => {
    const connection = await pool.getConnection();

    try {
      const query = `Select distinct industry_g_nse from benchmark`;

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
  getIndustries: async (getIndustries) => {
    const connection = await pool.getConnection();
    let listOfSectors = getIndustries.sectors?.split(",");
    try {
      const query = `SELECT DISTINCT industry_group FROM benchmark WHERE industry_g_nse IN (?)`;
      const loggableQuery = connection.format(query, [listOfSectors]);

      const [rows] = await connection.query(query, [listOfSectors]);

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
    const industries = getCompaniesByHandSelect.industries;

    let listOfIndustries = industries?.split(",");
    let industryGroupFilter = "";

    // Check if industries are provided
    if (industries) {
      industryGroupFilter = "industry_group IN (?) ";
    }

    // Function to replace NaN, null, or undefined with zero
    const replace = (value) => {
      return isNaN(value) || value === null || value === undefined ? 0 : value;
    };

    // Build conditions based on provided attributes
    const conditions = [];

    if (replace(getCompaniesByHandSelect.maxMarketCap) !== "0") {
      conditions.push(
        `(market_capitalisation_2022 BETWEEN ${replace(
          getCompaniesByHandSelect.minMarketCap
        )} AND ${replace(getCompaniesByHandSelect.maxMarketCap)})`
      );
    }

    if (replace(getCompaniesByHandSelect.maxAssets) !== "0") {
      conditions.push(
        `(total_assets_2022 BETWEEN ${replace(
          getCompaniesByHandSelect.minAssets
        )} AND ${replace(getCompaniesByHandSelect.maxAssets)})`
      );
    }

    if (replace(getCompaniesByHandSelect.maxSales) !== "0") {
      conditions.push(
        `(sales_2022 BETWEEN ${replace(
          getCompaniesByHandSelect.minSales
        )} AND ${replace(getCompaniesByHandSelect.maxSales)})`
      );
    }

    if (replace(getCompaniesByHandSelect.maxPAT) !== "0") {
      conditions.push(
        `(PAT_2022 BETWEEN ${replace(
          getCompaniesByHandSelect.minPAT
        )} AND ${replace(getCompaniesByHandSelect.maxPAT)})`
      );
    }

    try {
      let query = `
        SELECT distinct company_name, nse_symbol  
        FROM benchmark
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
  getCompaniesByHandSelectCount: async (getCompaniesByHandSelect) => {
    const connection = await pool.getConnection();
    const industries = getCompaniesByHandSelect.industries;

    let listOfIndustries = industries?.split(",");
    let industryGroupFilter = "";

    // Check if industries are provided
    if (industries) {
      industryGroupFilter = "industry_group IN (?) ";
    }

    // Function to replace NaN, null, or undefined with zero
    const replace = (value) => {
      return isNaN(value) || value === null || value === undefined ? 0 : value;
    };

    // Build conditions based on provided attributes
    const conditions = [];

    if (replace(getCompaniesByHandSelect.maxMarketCap) !== "0") {
      conditions.push(
        `(market_capitalisation_2022 BETWEEN ${replace(
          getCompaniesByHandSelect.minMarketCap
        )} AND ${replace(getCompaniesByHandSelect.maxMarketCap)})`
      );
    }

    if (replace(getCompaniesByHandSelect.maxAssets) !== "0") {
      conditions.push(
        `(total_assets_2022 BETWEEN ${replace(
          getCompaniesByHandSelect.minAssets
        )} AND ${replace(getCompaniesByHandSelect.maxAssets)})`
      );
    }

    if (replace(getCompaniesByHandSelect.maxSales) !== "0") {
      conditions.push(
        `(sales_2022 BETWEEN ${replace(
          getCompaniesByHandSelect.minSales
        )} AND ${replace(getCompaniesByHandSelect.maxSales)})`
      );
    }

    if (replace(getCompaniesByHandSelect.maxPAT) !== "0") {
      conditions.push(
        `(PAT_2022 BETWEEN ${replace(
          getCompaniesByHandSelect.minPAT
        )} AND ${replace(getCompaniesByHandSelect.maxPAT)})`
      );
    }

    try {
      let query = `
        SELECT COUNT(DISTINCT company_name) AS distinct_company_count
        FROM benchmark
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
  getCompaniesByIndex: async (getCompaniesByIndex) => {
    const connection = await pool.getConnection();

    let listOfIndustries = getCompaniesByIndex.industries?.split(",");

    try {
      const query = `SELECT company_name
      FROM benchmark
      WHERE  industry_group IN (?) AND ${getCompaniesByIndex.index} = 1;
        `;
      const loggableQuery = connection.format(query, [listOfIndustries]);

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
  getCompaniesCount: async (getCompaniesCount) => {
    const connection = await pool.getConnection();
    let listOfIndustries = getCompaniesCount.industries?.split(",");

    try {
      const query = `SELECT

    COUNT(DISTINCT company_name) AS distinct_company_count
FROM
    benchmark
WHERE  industry_group IN (?)
   
        `;
      const loggableQuery = connection.format(query, [listOfIndustries]);

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
  getCompaniesCountByMetrics: async (getCompaniesCountByMetrics) => {
    const connection = await pool.getConnection();
    // Function to replace NaN, null, or undefined with zero
    const replace = (value) => {
      return isNaN(value) || value === null || value === undefined ? 0 : value;
    };

    // Build conditions based on provided attributes
    const conditions = [];

    if (replace(getCompaniesCountByMetrics.maxMarketCap) !== "0") {
      conditions.push(
        `(market_capitalisation_2022 BETWEEN ${replace(
          getCompaniesCountByMetrics.minMarketCap
        )} AND ${replace(getCompaniesCountByMetrics.maxMarketCap)})`
      );
    }

    if (replace(getCompaniesCountByMetrics.maxAssets) !== "0") {
      conditions.push(
        `(total_assets_2022 BETWEEN ${replace(
          getCompaniesCountByMetrics.minAssets
        )} AND ${replace(getCompaniesCountByMetrics.maxAssets)})`
      );
    }

    if (replace(getCompaniesCountByMetrics.maxSales) !== "0") {
      conditions.push(
        `(sales_2022 BETWEEN ${replace(
          getCompaniesCountByMetrics.minSales
        )} AND ${replace(getCompaniesCountByMetrics.maxSales)})`
      );
    }

    if (replace(getCompaniesCountByMetrics.maxPAT) !== "0") {
      conditions.push(
        `(PAT_2022 BETWEEN ${replace(
          getCompaniesCountByMetrics.minPAT
        )} AND ${replace(getCompaniesCountByMetrics.maxPAT)})`
      );
    }

    try {
      const query = `SELECT

    COUNT(DISTINCT company_name) AS distinct_company_count
FROM
    benchmark
WHERE ( ${conditions.join(" OR ")});
   


        `;

      const loggableQuery = connection.format(query);

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
