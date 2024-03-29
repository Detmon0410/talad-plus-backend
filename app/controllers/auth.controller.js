const db = require("../models");
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const jwt = require("jsonwebtoken");

const User = db.user;
const Profile = db.profile;
const Market = db.market;

//api login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    if (!user) {
      return res
        .status(404)
        .send({ message: "Username or Password is incorrect or not found" });
    }
    let passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Username or Password!",
      });
    }
    const token = jwt.sign({ id: user.id }, "config.secret", {
      expiresIn: 360000,
    });
    res.cookie("token", token, {
      maxAge: 36000000000000,
      httpOnly: false,
      secure: false,
    });
    if (user.role != "Merchant") {
      const myUser = await Profile.findOne({ market: user });
      const myMarket = await Market.findOne({ owner: user });
      return res.status(200).send({
        name: user.name,
        role: user.role,
        img: myMarket.img,
        uid: myMarket._id,
        oid: user._id,
      });
    }
    const myUser = await Profile.findOne({ merchant: user });
    return res.status(200).send({
      name: user.name,
      role: user.role,
      img: myUser.img,
      uid: myUser._id,
      oid: user._id,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

//api register
exports.register = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    // simple validation
    if (!username || !password || !email) {
      return res.status(403).send({ message: "Please try again" });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const isDuplicate = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (isDuplicate) {
      return res
        .status(403)
        .send({ message: "username or email is duplicated" });
    }
    const user = new User({
      username: username,
      password: passwordHash,
      role: role,
      email: email,
      province: "",
    });
    const token = jwt.sign({ id: user.id }, "config.secret", {
      expiresIn: 360000,
    });
    res.cookie("token", token, {
      maxAge: 36000000000000,
      httpOnly: false,
      secure: false,
    });
    await user.save();
    return res.status(201).send({ message: "Register successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};
