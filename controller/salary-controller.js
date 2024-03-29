const SalaryModel = require("../models/salary-model");

const cities = [
  "Chandigarh",
  "New Delhi",
  "Hyderabad",
  "Ahmedabad",
  "Surat",
  "Vadodara",
  "Gurgaon",
  "Bangalore",
  "Bengaluru",
  "Kochi",
  "Indore",
  "Mumbai",
  "Pune",
  "Jaipur",
  "Chennai",
  "Coimbatore",
  "Lucknow",
  "Noida",
  "Kolkata",
  "Thane",
  "Delhi",
];

const experienceOptions = ["0-2", "2-5", "5-8", "8-11", "11-14", "15+"];

const filterCounts = (counts) => {
  return Object.fromEntries(
    Object.entries(counts).filter(([key, value]) => value > 10)
  );
};

// Helper function to transform counts object into an array of objects
const transformCountsToArray = (counts) => {
  return Object.entries(counts).map(([key, count]) => {
    const [location, experience, sector] = key
      .split(",")
      .map((item) => item.trim());
    return { location, experience, ...(sector && { sector }), count };
  });
};

const SalaryController = {
  getAllTitles: async (req, res) => {
    try {
      const data = await SalaryModel.getAllTitles(req.body);

      res.status(200).json({ status: 200, data: data });
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getAllSectors: async (req, res) => {
    try {
      const data = await SalaryModel.getAllSectors(req.body);

      res.status(200).json({ status: 200, data: data });
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getValidInputs: async (req, res) => {
    try {
      const sectorsResponse = await SalaryModel.getAllSectors(req.body);
      const sectorsRaw = sectorsResponse.map((s) => s.industry_type);

      const sectors = sectorsRaw.filter((s) => s !== "Nan");

      const profiles = await SalaryModel.getValidInputs(req.body);

      // Initialize counts object
      const counts = {};
      // Initialize counts object
      const countsWithSectors = {};

      // Loop through all combinations of cities and experience options
      cities.forEach((city) => {
        experienceOptions.forEach((experience) => {
          const key = `${city}, ${experience}`;
          counts[key] = 0; // Initialize count to 0 for each combination
        });
      });

      // Loop through all combinations of cities, experience options, and sectors
      cities.forEach((city) => {
        experienceOptions.forEach((experience) => {
          sectors.forEach((sector) => {
            const key = `${city}, ${experience}, ${sector}`;
            countsWithSectors[key] = 0; // Initialize count to 0 for each combination
          });
        });
      });

      // Loop through profiles to count occurrences of each combination
      profiles.forEach((profile) => {
        const location = profile.location.toLowerCase();
        const experience = profile.experience;

        // Check if location includes any city
        const city = cities.find((city) =>
          location.includes(city.toLowerCase())
        );

        if (city && experienceOptions.includes(experience)) {
          // Construct the key
          const key = `${city}, ${experience}`;

          // Increment count for the key
          counts[key]++;
        }
      });

      // Loop through profiles to count occurrences of each combination
      profiles.forEach((profile) => {
        const location = profile.location.toLowerCase();
        const experience = profile.experience;

        // Check if location includes any city
        const city = cities.find((city) =>
          location.includes(city.toLowerCase())
        );

        if (city && experienceOptions.includes(experience)) {
          // Check if industry_type includes any sector
          sectors.forEach((sector) => {
            if (
              profile.industry_type &&
              profile.industry_type.toLowerCase().includes(sector.toLowerCase())
            ) {
              // Construct the key
              const key = `${city}, ${experience}, ${sector}`;

              // Increment count for the key
              countsWithSectors[key]++;
            }
          });
        }
      });

      // Filter out counts with value greater than threshold
      const filteredCounts = filterCounts(counts);
      const filteredCountsWithSectors = filterCounts(countsWithSectors);

      // Transform the filtered counts into arrays of objects
      const countArray = transformCountsToArray(filteredCounts);

      const CountArrWithSectors = transformCountsToArray(
        filteredCountsWithSectors
      );

      res.status(200).json({
        status: 200,
        result: countArray,
        sector_result: CountArrWithSectors,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },

  salaryData: async (req, res) => {
    try {
      const data = await SalaryModel.salaryData(req.body);

      res.status(200).json({ data: data.rows, bool: data.bool });
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  salaryDataWithoutLoc: async (req, res) => {
    try {
      const data = await SalaryModel.salaryDataWithoutLoc(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  salaryDataWithoutExp: async (req, res) => {
    try {
      const data = await SalaryModel.salaryDataWithoutExp(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
};

module.exports = SalaryController;
