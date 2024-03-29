require("dotenv").config({ path: "../../.env" });
const db = require("../models");
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const User = db.user;
const Withdraw = db.withdraw;

exports.getMyWithdraw = async (req, res) => {
  try {
    const wallet = await Withdraw.find({ status: "กำลังดำเนินการ" });
    return res.status(200).send(wallet);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.approveTransfer = async (req, res) => {
  try {
    const withdraw = await Withdraw.findById(req.params.withdraw);
    withdraw.status = "สำเร็จ";
    await withdraw.save();
    return res.status(200).send(withdraw);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.rejectTransfer = async (req, res) => {
  try {
    const withdraw = await Withdraw.findById(req.params.withdraw);
    withdraw.status = "ล้มเหลว";
    await withdraw.save();
    return res.status(200).send(withdraw);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};
