const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// @route   GET api/users
// @desc    Test route
// @access  public
router.get("/", (req, res) => res.send("User route"));

// @route   POST api/users
// @desc    Reguster a user
// @access  public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with six or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // bad request
    }
    const { name, email, password } = req.body;
    try {
      // Check if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists." }] });
      }

      // Get users gravatar (based on their email)
      // This will run only if the user wasn't previously found
      const avatar = gravatar.url(email, {
        s: "200", // size
        r: "pg", // rating
        d: "mm", // default image
      });

      // Create the user, we get the fields from req.body
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt the password using bcrypt
      const salt = await bcrypt.genSalt(10); // to do the hashing. 10 represent the number of rounds. The more there is - the more secure, but slower.
      user.password = await bcrypt.hash(password, salt); // Creates a hash of the password and sets it to the User obj.
      await user.save(); // waits for user to be saved before continuing

      /* Without using the await:
        const salt1 = bcrypt
          .genSalt(10)
          .then(bcrypt.hash(password, salt1).then(... etc)); */

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
