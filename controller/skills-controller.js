const SkillsModel = require("../models/skills-model");

const SkillsController = {
  getSkillsByRoles: async (req, res) => {
    try {
      const data = await SkillsModel.getSkillsByRoles(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
  getTopSkills: async (req, res) => {
    try {
      const data = await SkillsModel.getTopSkills(req.body);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: err });
    }
  },
};

module.exports = SkillsController;
