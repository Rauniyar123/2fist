/*.........import models............*/
const User = require("../models/user_models");



/*............import dependancies................*/
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();
const moment = require('moment-timezone');


/*.................make function and user it........*/
function unique_user() {
  const OTP = Math.floor(100000 + Math.random() * 900000);
  return OTP;
}

function generateRandomString() {
  const characters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const length = 8;
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(index);
  }

  return randomString;
}

function generateRandomNumber() {
  const characters = "0123456789";
  const length = 16;
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(index);
  }

  return randomString;
}

function generateFriendQrcode() {
  const characters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const length = 250;
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(index);
  }

  return randomString;
}

function generatePaymentQrcode() {
  const characters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const length = 250;
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(index);
  }

  return randomString;
}

function generateOrderQrcode() {
  const characters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const length = 50;
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(index);
  }

  return randomString;
}

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}




const userSignupApi = async (req, res) => {
  try {
    const {
      userName,
      email,
      password,
      conformPassword,
      fcmId,
      countryName,
     
    } = req.body;
   
    if (
      !userName ||
      !countryName ||
      !email ||
      !password ||
      !conformPassword ||
      !fcmId
    ) {
      return res.status(400).json({
        result: "false",
        message:
          "required parameters are userName,email,countryName,password,conformPassword,fcmId ",
      });
    }

    const exist_user = await User.findOne({email});
    if (exist_user) {
      return res
        .status(400)
        .json({ result: "false", message: "User allready exist" });
    }
    if (password !== conformPassword) {
      return res
        .status(400)
        .json({ result: "false", message: "Passwords do not match." });
    }

    const hashedPasswords = await bcrypt.hash(password, 10);
    const name=unique_user()
    const uniqueName = userName + name;

    const insertUser=new User({userName,uniqueName,email,password:hashedPasswords,countryName,fcmId});
      const data=  await insertUser.save();
        res.status(200).json({
          result: "true",
          message: "User signup sucessfully",
          data: data,
        });

  } catch (err) {
    res.status(400).json({ result: "false", message: err.message });
    console.log(err.message);
  }
};




/*................user_login.................*/
const userLoginApi = async (req, res) => {
  try {
    const {email, password, fcmId } = req.body;
    if (!password || !email ){
    return   res.status(400).json({
        result: "false",
        message:
          "required parameters are password and email ,fcmId",
      });
    } 
      const Data = await User.findOne({
       email
      });

      if (!Data) {
        return res
          .status(400)
          .json({ result: "false", message: "You are not register" });
      } 

          // Match password
          const passwordMatch = await bcrypt.compare(
            password,
            Data.password
          );
          //generate token
          const token = jwt.sign(
            {
              userId: Data._id,
              email: Data.email,
              uniqueName: Data.uniqueName,
            },
            process.env.ACCESS_TOKEN_SECURITY,
            { expiresIn: "730d" }
          );
          if (passwordMatch) {
            res.status(200).json({
              result: "true",
              message: "User login successfully",
              data: Data,
              token,
            });
          } else {
            res.status(400).json({
              result: "false",
              message: "Invalid password",
            });
          }
     
  } catch (err) {
    res.status(400).json({ result: "false", message: err.message });
  }
};



/*................ForgotPassword....................*/
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({
      result: "false",
      message:
        "required parameter is email",
    });
  }
  try {
    const data = await User.findOne({
      email
    });
    if (data) {
      res
        .status(200)
        .json({ result: "true", message: "Email matched sucessfully", data:data });
    } else {
      res.status(400).json({
        result: "false",
        message: "Please send correct email",
      });
    }
  } catch (err) {
    res.status(400).json({ result: "false", message: err.message });
  }
};



// resetPassword
const resetPassword = async (req, res) => {
  const {email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      result: "false",
      message: "required parameter are password, email",
    });
  }
  try {
    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      {email},
      { $set: { password: hashedPassword } },
      { new: true }
    );
    res
      .status(200)
      .json({ result: "true", message: "Password reset sucessfully" });
  } catch (err) {
    console.log(err.mesage);
  }
};



/*...................update userProfile............*/
const updateUser_profile = async (req, res) => {
  try {
    const { first_name, gender, mobile_number, email, last_name, dob, userId } =
      req.body;
    const user_profile = req.file ? req.file.filename : null;

    if (!userId) {
      return res.status(400).json({
        result: "false",
        message:
          "required parameter is userId and optional parameters are first_name,last_name,mobile_number,email,gender,dob,user_profile",
      });
    }

    const matchData = await User.findOne({ _id: userId });
    if (!matchData) {
      return res.status(400).json({
        result: "false",
        message: "User does not exist",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).json({
        result: "false",
        message: "Failed to update user",
      });
    }

    res.status(200).json({
      result: "true",
      message:"User data updated sucessfully",
    });

  } catch (err) {
    res.status(400).json({ result: "false", message: err.message });
  }
};



/*................getUser_profile................*/
const getUser_profile = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
     return res
        .status(400)
        .json({ result: "false", message: "required parameter userId" });
    }
      const matchData = await User.findOne({ _id: userId });
      if(!matchData){
        return res
        .status(400)
        .json({ result: "false", message: "Record not found" });
      }
     
        res.status(200).json({
          result: "true",
          message: "user profile data are",
          path:process.env.image_url,
          data: [matchData],
        });
    
  } catch (err) {
    res.status(400).json({ result: "false", message: err.message });
  }
};




/*....................exports variables...........*/
module.exports = {
  userSignupApi,
  userLoginApi,
  forgotPassword,
  resetPassword,
  updateUser_profile,
  getUser_profile,
 
};
