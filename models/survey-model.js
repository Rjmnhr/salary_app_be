const pool = require("../mySQL-DB");
const exceljs = require("exceljs");

const SurveyModel = {
  storeExcelData: async (fileBuffer) => {
    const connection = await pool.getConnection();

    try {
      // Create a workbook from the file buffer
      const workbook = new exceljs.Workbook();

      await workbook.xlsx.load(fileBuffer);

      // Assuming the worksheet is the first sheet in the workbook
      const worksheet = workbook.worksheets[0];

      // Define values to skip
      const skipValues = [
        "Table 1",
        "Column 1",
        "Column 2",
        "Column 3",
        "Column 4",
        "Column 5",
        "Column 6",
        "Column 7",
      ];

      // Iterate through rows and insert into the database
      await worksheet.eachRow(
        { includeEmpty: true },
        async (row, rowNumber) => {
          const firstCellValue = row.getCell(1).value;

          // Skip rows with undesired values
          if (skipValues.includes(firstCellValue)) {
            console.log(
              `Skipping row ${rowNumber} with value: ${firstCellValue}`
            );
            return;
          }

          // Check if all values in the row are NULL, skip the row if true
          const allNullValues = row.values.every((value) => value === null);
          if (allNullValues) {
            console.log(`Skipping row ${rowNumber} with all NULL values`);
            return;
          }

          console.log("entered");
          const query = `INSERT INTO survey_data (column1, column2, column3, column4, column5, column6, column7) VALUES (?, ?, ?, ?, ?, ?, ?)`;
          const values = [
            row.getCell(1).value,
            row.getCell(2).value,
            row.getCell(3).value,
            row.getCell(4).value,
            row.getCell(5).value,
            row.getCell(6).value,
            row.getCell(7).value,
          ];

          await connection.execute(query, values);
        }
      );

      return { message: "Data stored successfully" };
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
        INSERT INTO survey_register (name, email, phone, title, organization, sector , revenue)
        VALUES (?, ?, ?, ?,?, ?, ?)
      `;

      const [rows] = await connection.query(query, [
        register.name,
        register.email,
        register.phone,
        register.title,
        register.organization,
        register.sector,
        register.revenue,
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
