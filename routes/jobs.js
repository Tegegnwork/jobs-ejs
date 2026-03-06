const express = require("express");
const router = express.Router();
const jobsController = require("../controllers/jobs");

// Display all jobs
router.get("/", jobsController.index);

// Show new job form
router.get("/new", jobsController.new);

// Create job
router.post("/", jobsController.create);

// Show edit form
router.get("/edit/:id", jobsController.edit);

// Update job
router.post("/update/:id", jobsController.update);

// Delete job
router.post("/delete/:id", jobsController.delete);

module.exports = router;