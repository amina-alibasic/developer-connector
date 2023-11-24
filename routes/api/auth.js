const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../config/models/user");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

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

// @route   POST api/auth
// @desc    Autheticate a user and get token
// @access  public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required.").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // bad request
    }
    const { email, password } = req.body;
    try {
      // Check if user exists
      let user = await User.findOne({ email }); // request to DB to get the user by email
      // if no user was found, that means the email passed in request body does not exist in the DB
      if (!user) {
        return res.status(400).json({
          errors: [{ msg: `User with ${email} email does not exist` }],
        });
      }

      // now check for password match, this will execute only if user was previously found and stored in variable "user"
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: "Password is incorrect" }],
        });
      }

      // Return the JSON Web Token (JWT)
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000000 },
        (err, token) => {
          if (err) throw err;
          return res.json({ token }); // we set this token in request's headers and access protective routes
        }
      ); // 36 000 = 1hr
      //res.send("User registered."); // this appears in the browser after sending POST request with Postman
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }

    console.log(req.body); // Object of data that's gonna be sent to this route, this appears in the console
  }
);

module.exports = router;
