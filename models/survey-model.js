const pool = require("../mySQL-DB");
const exceljs = require("exceljs");

const SurveyModel = {
  storeExcelData: async (fileBuffer, data) => {
    const connection = await pool.getConnection();

    const { name, organization, title } = data;
    try {
      const workbook = new exceljs.Workbook();
      await workbook.xlsx.load(fileBuffer);

      // Assuming the worksheet is the first sheet in the workbook
      const worksheet = workbook.worksheets[0];

      // Get the column names from the first row
      const columns = worksheet
        .getRow(1)
        .values.map((column) => column.replace(/[^\w]/g, "_").toLowerCase());

      // Create a table name with name, organization, title, current day, and month
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1; // Month is zero-based
      const year = currentDate.getFullYear();

      const convertedName =
        `${name}_${organization}_${title}_${day}_${month}_${year}`
          .replace(/[^\w]/g, "_")
          .toLowerCase();

      // Generate the CREATE TABLE query
      const nonEmptyColumns = columns.filter(
        (column) => column && column.trim() !== ""
      );

      const createTableQuery = `CREATE TABLE IF NOT EXISTS ${convertedName} (${nonEmptyColumns
        .map((column) => `${column} VARCHAR(255)`)
        .join(", ")})`;

      // Create the table
      await connection.execute(createTableQuery);

      // Iterate through rows starting from the second row (data rows)
      for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
        const row = worksheet.getRow(rowNumber);

        // Check if all values in the row are NULL, skip the row if true
        const allNullValues = row.values.every((value) => value === null);
        if (allNullValues) {
          console.log(`Skipping row ${rowNumber} with all NULL values`);
          continue;
        }

        const insertQuery = `INSERT INTO ${convertedName} (${nonEmptyColumns.join(
          ", "
        )}) VALUES (${nonEmptyColumns.map(() => "?").join(", ")})`;

        const values = row.values.map((value) =>
          value === null ? null : String(value)
        );
        const loggableQuery = connection.format(insertQuery, values);

        // Insert data into the table
        await connection.execute(insertQuery, values);
      }

      return { message: "Table created and data stored successfully" };
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      connection.release();
    }
  },

  register: async (register) => {
    const connection = await pool.getConnection();

    try {
      const query = `
        INSERT INTO survey_submission (name, email, phone, title, organization, sector , revenue , geographies)
        VALUES (?, ?, ?, ?,?, ?, ?, ?)
      `;

      const [rows] = await connection.query(query, [
        register.name,
        register.email,
        register.phone,
        register.title,
        register.organization,
        register.sector,
        register.revenue,
        register.geographies,
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

module.exports = SurveyModel;
