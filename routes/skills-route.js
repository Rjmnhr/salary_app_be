const express = require("express");
const SkillsController = require("../controller/skills-controller");
const router = express.Router();

router.post("/data", SkillsController.getSkillsByRoles);

module.exports = router;
