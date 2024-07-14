//import express

const express = require("express");

//import userController

const userController = require("./controllers/userController");
const jwtMiddleware = require("./middleware/jwtMiddleware");
const adminController = require("./controllers/adminController");
const multerConfig = require("./middleware/multerMiddleware");
// const resumeConfig = require("./middleware/multerResumeMiddleware");

//create router
const router = new express.Router();

//path to resolve admin to register
router.post("/admin/register", adminController.adminLogin);

//path to resolve jobSeeker Request for register
router.post("/jobseeker/register", userController.jobSeekerRegister);

//path to resolve jobSeeker Request for login
router.post("/jobseeker/login", userController.jobseekersLogin);

//path to resolve recruiter Request for register
router.post("/recruiter/register", userController.recruiterRegister);

//path to resolve recruiter Request for login
router.post("/recruiter/login", userController.recruiterLogin);

//path to resolve recruiter Request for Job Post
router.post(
  "/recruiter/message",
  jwtMiddleware,
  userController.recruiterJobPost
);

//path to resolve recruiters all job Post
router.get("/jobseeker/posts", userController.showJobPosts);

//path to resolve verified posts by admin
router.post("/admin/accept", userController.verifiedJobPosts);

//path to resolve reject posts by admin
router.post("/admin/reject", userController.rejectJobPosts);

//path to resolve reject posts by admin
router.get("/jobseeker/acceptedPosts", userController.allAcceptedPosts);

//path to resolve job posts that are applied by jobseeker
router.post("/jobseeker/apply", userController.applyJobPosts);

//path to resolve applied jobs for a user
router.get("/jobseeker/:userId/applied-jobs", userController.getAppliedJobs);

//path to resolve get posts of applied user
router.post("/recruiter/jobPosts", userController.getUsersAppliedJobPosts);

router.put(
  "/jobseeker/profile/update",
  jwtMiddleware,
  multerConfig.fields([
    { name: "profile", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  userController.updateJobSeekerProfile
);

router.post("/recruiter/sendEmail/accept", userController.sendAcceptedEmail);
router.post("/recruiter/sendEmail/reject", userController.sendRejectedEmail);

router.get("/jobseeker/getAll", userController.getAllJobSeeker);
router.get("/recruiter/getAll", userController.getAllRecruiter);

router.delete("/jobseeker/delete", userController.deleteJobSeeker);
router.delete("/recruiter/delete", userController.deleteRecruiter);

module.exports = router;
