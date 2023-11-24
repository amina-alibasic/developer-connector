const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../config/models/user");

// @route   GET api/auth
// @desc    Test route
// @access  public
// router.get("/", (req, res) => res.send("Auth route"));
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // leave off the password in data retuned
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
/* 
Whenever we want to use middleware, we add it as a second parameter.
That will make this route protected.
*/

module.exports = router;
