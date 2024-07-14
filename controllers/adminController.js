const bcrypt = require("bcrypt");
const admins = require("../model/adminSchema");
const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);
  try {
    const exisitingAdmin = await admins.findOne({ email });
    if (!exisitingAdmin) {
      return res.status(400).json("Admin not found");
    }

    bcrypt.compare(password, exisitingAdmin.password, (err, result) => {
      if (err) {
        return res.status(402).json("Password hashing error");
      }
      if (!result) {
        return res.status(403).json("Incorrect password");
      }
      const token = jwt.sign({ userId: exisitingAdmin._id }, "secretsuperkey");
      res.status(200).json({ token, exisitingAdmin });
    });
  } catch (error) {
    res.status(401).json(error);
  }
};
