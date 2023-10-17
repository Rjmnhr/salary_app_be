const express = require("express");
const SkillsController = require("../controller/skills-controller");
const router = express.Router();

router.post("/data", SkillsController.getSkillsByRoles);

router.post("/data/top-skills", SkillsController.getTopSkills);

module.exports = router;
