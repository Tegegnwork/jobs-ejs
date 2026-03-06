const Job = require("../models/Job");
const parseVErr = require("../util/parseValidationErr");

const index = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id });
    res.render("jobs", { jobs });
  } catch (error) {
    req.flash("error", "Error retrieving jobs");
    res.redirect("/");
  }
};

const newJob = (req, res) => {
  res.render("job", { job: null });
};

const create = async (req, res) => {
  try {
    await Job.create({ ...req.body, createdBy: req.user._id });
    res.redirect("/jobs");
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
    } else {
      req.flash("error", "Error creating job");
    }
    return res.render("job", { job: null, errors: req.flash("error") });
  }
};

const edit = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!job) {
      req.flash("error", "Job not found");
      return res.redirect("/jobs");
    }
    res.render("job", { job });
  } catch (error) {
    req.flash("error", "Error retrieving job");
    res.redirect("/jobs");
  }
};

const update = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) {
      req.flash("error", "Job not found");
      return res.redirect("/jobs");
    }
    res.redirect("/jobs");
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
    } else {
      req.flash("error", "Error updating job");
    }
    try {
      const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id });
      return res.render("job", { job, errors: req.flash("error") });
    } catch {
      return res.redirect("/jobs");
    }
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!job) {
      req.flash("error", "Job not found");
    }
    res.redirect("/jobs");
  } catch (error) {
    req.flash("error", "Error deleting job");
    res.redirect("/jobs");
  }
};

module.exports = {
  index,
  new: newJob,
  create,
  edit,
  update,
  delete: deleteJob,
};