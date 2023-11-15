const BenchmarkModel = require("../models/benchmark-model");

const BenchmarkController = {
  getData: async (req, res) => {
    try {
      const data = await BenchmarkModel.getData(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getData2021: async (req, res) => {
    try {
      const data = await BenchmarkModel.getData2021(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getData2022: async (req, res) => {
    try {
      const data = await BenchmarkModel.getData2022(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getDistinctCompanies: async (req, res) => {
    try {
      const data = await BenchmarkModel.getDistinctCompanies(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getSectors: async (req, res) => {
    try {
      const data = await BenchmarkModel.getSectors(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getIndustries: async (req, res) => {
    try {
      const data = await BenchmarkModel.getIndustries(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getIndustriesByIndex: async (req, res) => {
    try {
      const data = await BenchmarkModel.getIndustriesByIndex(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getCompaniesByHandSelect: async (req, res) => {
    try {
      const data = await BenchmarkModel.getCompaniesByHandSelect(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getCompaniesByHandSelectCount: async (req, res) => {
    try {
      const data = await BenchmarkModel.getCompaniesByHandSelectCount(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getCompaniesByIndex: async (req, res) => {
    try {
      const data = await BenchmarkModel.getCompaniesByIndex(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getCompaniesByIndexCount: async (req, res) => {
    try {
      const data = await BenchmarkModel.getCompaniesByIndexCount(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getCompaniesCount: async (req, res) => {
    try {
      const data = await BenchmarkModel.getCompaniesCount(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getCompaniesCountForIndex: async (req, res) => {
    try {
      const data = await BenchmarkModel.getCompaniesCountForIndex(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getCompaniesCountByMetrics: async (req, res) => {
    try {
      const data = await BenchmarkModel.getCompaniesCountByMetrics(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getCompaniesCountIndices: async (req, res) => {
    try {
      const data = await BenchmarkModel.getCompaniesCountIndices(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
};

module.exports = BenchmarkController;
