const express = require("express");

// controller functions
const { signupUser, loginUser, verifyUserIdentity, logoutUser } = require("../controllers/userController");
const { requireAuth } = require("../middleware/requireAuth.js");


const router = express.Router();

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

router.post("/logout", logoutUser)

router.post('/verify', requireAuth, verifyUserIdentity)

module.exports = router;
