const express = require("express");
const Logic= require("../controllers/usersController");

const router = express.Router();

router.post("/register", Logic.registerUser);
router.post("/login", Logic.loginUser);
router.get("/get-users",Logic.getUsers)
router.post("/send-otp",Logic.sendOTP)
router.post("/verify-otp",Logic.verifyOtp)
// router.get("/new-members-count",Logic.newMembersCount)

module.exports = router;
