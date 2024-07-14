const jobseekers = require("../model/jobSeekerUserSchema");
const bcrypt = require("bcrypt");
const recruiters = require("../model/recruiterUserSchema");
const jwt = require("jsonwebtoken");
const jobPost = require("../model/jobPostUserSchema");
const verifiedPosts = require("../model/verifiedPostSchema");
const appliedUser = require("../model/appliedUserSchema");
const nodemailer = require("nodemailer");
const copyAppliedUser = require("../model/copyAppliedUserSchema");

exports.jobSeekerRegister = async (req, res) => {
  const { username, email, password, github, experience } = req.body;

  try {
    // Check if user already exists
    const existingUser = await jobseekers.findOne({ github });
    if (existingUser) {
      return res.status(400).json("User has already been registered");
    }

    // Handle resume upload

    // Hash password and save user
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return res.status(500).json({ error: "Error generating salt" });
      }
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          return res.status(403).json({ error: "Error hashing password" });
        }
        try {
          const newUser = new jobseekers({
            username,
            email,
            password: hash,
            github,
            experience,
            profile: "", // Assuming you handle profile image separately
            resume: "",
          });
          await newUser.save();
          res.status(200).json(newUser);
        } catch (err) {
          res.status(402).json("Error saving user");
        }
      });
    });
  } catch (error) {
    res.status(401).json(error);
  }
};
exports.jobseekersLogin = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);
  // console.log("inside jobSeeker login controller");
  try {
    const existingUser = await jobseekers.findOne({
      email,
    });
    if (!existingUser) {
      return res.status(404).json("User not found");
    }

    bcrypt.compare(password, existingUser.password, (err, result) => {
      if (err) {
        return res.status(500).json("Something went wrong during hashing");
      }

      if (!result) {
        return res.status(401).json("Incorrect password");
      }

      const token = jwt.sign({ userId: existingUser._id }, "secretsuperkey");
      console.log(token);
      res.status(200).json({ token, existingUser });
    });
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};
exports.recruiterRegister = async (req, res) => {
  const { username, email, password, organization_name } = req.body;
  // console.log("Inside recruiter register control");
  // console.log(username, email, password, organization_name);

  try {
    const existingUser = await recruiters.findOne({ email });
    if (existingUser) {
      res.status(400).json("user already exists");
    } else {
      bcrypt.genSalt(10, function (err, salt) {
        if (err) {
          res.status(401).json("Error while hashing password");
        }
        bcrypt.hash(password, salt, async function (err, hash) {
          if (err) {
            res.status(401).json("Error while hashing password");
          }
          try {
            const newUser = new recruiters({
              username,
              email,
              password: hash,
              organizationName: organization_name,
            });
            await newUser.save();
            res.status(200).json(newUser);
          } catch (error) {
            res.status(402).json("hashing error");
          }
        });
      });
    }
  } catch (error) {
    res.status(401).json(error);
  }
};
exports.recruiterLogin = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);
  // console.log("inside recruiter login controller");
  try {
    const existingUser = await recruiters.findOne({ email });
    if (!existingUser) {
      return res.status(404).json("User not found");
    }

    bcrypt.compare(password, existingUser.password, (err, result) => {
      if (err) {
        return res.status(500).json("Something went wrong during hashing");
      }

      if (!result) {
        return res.status(401).json("Incorrect password");
      }

      const token = jwt.sign({ userId: existingUser._id }, "secretsuperkey");
      console.log(token);
      res.status(200).json({ token, existingUser });
    });
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};
exports.recruiterJobPost = async (req, res) => {
  const { title, experience, jobDescription } = req.body;
  // console.log(title, experience, jobDescription);

  try {
    const userId = req.payload;
    console.log(userId);
    const existingUser = await recruiters.findOne({ _id: userId });
    console.log(`The existing user is:${existingUser}`);

    const newMessage = new jobPost({
      title,
      experience,
      description: jobDescription,
      username: existingUser.username,
      organizationName: existingUser.organizationName,
    });

    await newMessage.save();
    res.status(200).json(newMessage);
  } catch (error) {
    console.log(res.status(401).json(`Request failed due to ${error}`));
  }
};
exports.verifiedJobPosts = async (req, res) => {
  const { jobPostId } = req.body;
  // console.log(jobPostId);

  try {
    const exisitingPosts = await jobPost.findOne({ _id: jobPostId });
    console.log(exisitingPosts);

    if (!exisitingPosts) {
      res.status(401).json("No posts found");
    }

    const newVerifiedPosts = new verifiedPosts({
      title: exisitingPosts.title,
      experience: exisitingPosts.experience,
      description: exisitingPosts.description,
      username: exisitingPosts.username,
      organizationName: exisitingPosts.organizationName,
    });
    await newVerifiedPosts.save();
    await jobPost.findByIdAndDelete(jobPostId);
    res.status(200).json("Job post verified and deleted successfully");
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.rejectJobPosts = async (req, res) => {
  const { jobPostId } = req.body;

  try {
    const exisitingPosts = await jobPost.findOne({ _id: jobPostId });
    if (exisitingPosts) {
      await jobPost.findByIdAndDelete(jobPostId);
      res.status(200).json("Job post has been deleted successfully");
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.showJobPosts = async (req, res) => {
  try {
    const jobPosts = await jobPost.find();
    res.status(200).json(jobPosts);
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.allAcceptedPosts = async (req, res) => {
  try {
    const jobPost = await verifiedPosts.find();
    res.status(200).json(jobPost);
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.applyJobPosts = async (req, res) => {
  const { userId } = req.body;
  const { jobTitle } = req.body;
  const { organizationName } = req.body;
  try {
    const userDetails = await jobseekers.findOne({ _id: userId });
    console.log(userDetails);
    if (userDetails) {
      const github = userDetails.github;
      console.log(github);

      const applyJob = new appliedUser({
        email: userDetails.email,
        github: userDetails.github,
        jobSeekerName: userDetails.username,
        resume: userDetails.resume,
        jobTitle,
        userId,
        organizationName,
      });

      const copyApplyJob = new copyAppliedUser({
        email: userDetails.email,
        github: userDetails.github,
        jobSeekerName: userDetails.username,
        resume: userDetails.resume,
        jobTitle,
        userId,
        organizationName,
      });
      await copyApplyJob.save();
      await applyJob.save();
      res.status(200).json(applyJob);
    } else {
      res.status(401).json("Can't find the user");
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.getAppliedJobs = async (req, res) => {
  const { userId } = req.params;
  try {
    const appliedJobs = await appliedUser.find({ userId }).select("jobTitle");
    const jobTitles = appliedJobs.map((job) => job.jobTitle);
    res.status(200).json(jobTitles);
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.getUsersAppliedJobPosts = async (req, res) => {
  const { organizationName } = req.body;
  try {
    const findJobPosts = await copyAppliedUser.find({ organizationName });
    if (findJobPosts) {
      res.status(200).json(findJobPosts);
    } else {
      res.status(401).json("Can'find job posts");
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.updateJobSeekerProfile = async (req, res) => {
  const userId = req.payload;

  const { username, email, github } = req.body;
  const profileImage = req.files.profile
    ? req.files.profile[0].filename
    : req.body.profile;
  const resumeFile = req.files.resume
    ? req.files.resume[0].filename
    : req.body.resume;

  try {
    const existingUser = await jobseekers.findByIdAndUpdate(
      { _id: userId },
      {
        username,
        email,
        github,
        profile: profileImage,
        resume: resumeFile,
      },
      { new: true }
    );

    await existingUser.save();
    res.status(200).json(existingUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.sendAcceptedEmail = async (req, res) => {
  try {
    const {
      jobSeekerName,
      jobSeekerEmail,
      jobTitle,
      organizationName,
      email,
      postId,
    } = req.body;

    // console.log(postId);

    // Create a transporter object using Gmail's SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // your Gmail account
        pass: process.env.GMAIL_PASS, // your Gmail password or app password
      },
    });

    // Setup email data
    let mailOptions = {
      from: `"${organizationName}" <${email}>`, // sender address
      to: jobSeekerEmail, // list of receivers
      subject: "We are happy to be working with you", // Subject line
      text: `Dear ${jobSeekerName},\n\nCongratulations on being selected for the next round of interviews for the ${jobTitle} position at ${organizationName}! We will notify you shortly regarding the details.\n\nBest regards,\n${organizationName}`,
    };

    // Send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    // console.log("Message sent: %s", info.messageId);
    res.status(200).json({ message: "Email sent successfully!", info });
    await copyAppliedUser.findByIdAndDelete(postId);
  } catch (error) {
    // console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
};
exports.sendRejectedEmail = async (req, res) => {
  try {
    const {
      jobSeekerName,
      jobSeekerEmail,
      jobTitle,
      organizationName,
      email,
      postId,
    } = req.body;

    // Create a transporter object using Gmail's SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // your Gmail account
        pass: process.env.GMAIL_PASS, // your Gmail password or app password
      },
    });

    // Setup email data
    let mailOptions = {
      from: `"${organizationName}" <${email}>`, // sender address
      to: jobSeekerEmail, // list of receivers
      subject: "Update on Your Application", // Subject line
      text: `Dear ${jobSeekerName},\n\nWe regret to inform you that after careful consideration, we have decided not to move forward with your application for the ${jobTitle} position at ${organizationName}. We appreciate your interest and the time you invested in the interview process.\n\nBest regards,\n${organizationName}`,
    };

    // Send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    // console.log("Message sent: %s", info.messageId);
    res.status(200).json({ message: "Email sent successfully!", info });
    await copyAppliedUser.findByIdAndDelete(postId);
  } catch (error) {
    // console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
};
exports.getAllJobSeeker = async (req, res) => {
  try {
    const allJobSeekers = await jobseekers.find();
    res.status(200).json(allJobSeekers);
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.getAllRecruiter = async (req, res) => {
  try {
    const allRecruiters = await recruiters.find();
    res.status(200).json(allRecruiters);
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.deleteJobSeeker = async (req, res) => {
  const { id } = req.body;
  // console.log(id);
  try {
    const exisitingUser = await jobseekers.findOne({ _id: id });
    if (exisitingUser) {
      await jobseekers.findByIdAndDelete(id);
      res.status(200).json("Jobseeker has been deleted successfully");
    } else {
      res.status(401).json("User not found");
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.deleteRecruiter = async (req, res) => {
  const { id } = req.body;
  // console.log(id);
  try {
    const exisitingUser = await recruiters.findOne({ _id: id });
    if (exisitingUser) {
      await recruiters.findByIdAndDelete(id);
      res.status(200).json("Recruiter has been deleted successfully");
    } else {
      res.status(401).json("User not found");
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
