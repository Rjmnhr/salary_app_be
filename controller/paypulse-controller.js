const PriceAJobModel = require("../models/paypulse-model");
const { cities, experienceOptions } = require("../config/constants");
const {
  filterCounts,
  transformCountsToArray,
} = require("../utils/price-a-job-helper");

const PriceAJobController = {
  getAllTitles: async (req, res) => {
    try {
      const data = await PriceAJobModel.getAllTitles(req.body);

      res.status(200).json({ status: 200, data: data });
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getAllSectors: async (req, res) => {
    try {
      const data = await PriceAJobModel.getAllSectors(req.body);

      res.status(200).json({ status: 200, data: data });
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getValidInputs: async (req, res) => {
    try {
      const sectorsResponse = await PriceAJobModel.getAllSectors(req.body);
      const sectorsRaw = sectorsResponse.map((s) => s.sectors);

      const sectors = sectorsRaw.filter((s) => s !== "Nan");

      const profiles = await PriceAJobModel.getValidInputs(req.body);

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
  getTopSkills: async (req, res) => {
    try {
      const data = await PriceAJobModel.getTopSkills(req.body);

      res.status(200).json({ status: 200, data: data });
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getRelevantSkills: async (req, res) => {
    try {
      const data = await PriceAJobModel.getRelevantSkills(req.body);

      res.status(200).json({ status: 200, data: data });
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },

  salaryData: async (req, res) => {
    try {
      const data = await PriceAJobModel.salaryData(req.body);

      res.status(200).json({ data: data.rows, bool: data.bool });
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  salaryDataWithoutLoc: async (req, res) => {
    try {
      const data = await PriceAJobModel.salaryDataWithoutLoc(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  salaryDataWithoutExp: async (req, res) => {
    try {
      const data = await PriceAJobModel.salaryDataWithoutExp(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
};

module.exports = PriceAJobController;
