const db = require("../models");
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const jwt = require("jsonwebtoken");
const { profile } = require("../models");

const User = db.user;
const Profile = db.profile;

exports.editProfile = async (req, res) => {
  try {
    const data = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    await user.save();
    return res.status(200).send({ status: "Market edited" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: "Please try again" });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const myUser = await Profile.findOne({ merchant: req.user });
    console.log(myUser);
    return res.status(200).send(myUser);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.createProfile = async (req, res) => {
  try {
    const { name, province, district, address, phone, subdistrict } = req.body;

    // simple validation
    if (!name || !province || !district || !address || !phone) {
      return res.status(403).send({ message: "Please try again" });
    }
    if (req.user.role != "merchant") {
      return res.status(403).send({ message: "you are not merchant" });
    }

    const user = await User.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    const profile = new Profile({
      name: name,
      province: province,
      district: district,
      address: address,
      phone: phone,
      subdistrict: subdistrict,
    });

    await profile.save();
    return res.status(201).send({ message: "Register successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.merchantregister = async (req, res) => {
  try {
    const { name, phone, address, district, province, post } = req.body;
    let image_b64 = "";
    if (req.files) {
      image_data = req.files.img;
      image_b64 = image_data.data.toString("base64");
    }

    // simple validation
    if (!name || !phone || !address || !district || !province || !post) {
      return res.status(403).send({ message: "Please try again" });
    }
    const myMyprofile = await Profile.findOne({ merchant: req.user });
    console.log(myMyprofile);
    if (myMyprofile) {
      return res.status(403).send({ message: "Duplicate Name" });
    }
    if (req.user.role != "Merchant") {
      return res.status(403).send({ message: "you are not Merchant" });
    }
    const merchant = new Profile(req.body);
    merchant.merchant = req.user;
    merchant.img = image_b64;

    await merchant.save();
    console.log(merchant);
    res.status(201).send({ message: "Register successfully" });
  } catch (err) {
    console.log(err);
    return res.status(403).send({ message: "Duplicate username" });
  }
};
