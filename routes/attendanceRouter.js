const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

router.route("/").get(attendanceController.getAttendance);

router.route("/calculate").post(attendanceController.calculateAttendance);

module.exports = router;
