const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../config/models/user");
const Profile = require("../../config/models/Profile");
const auth = require("../../middleware/auth");

// @route   GET api/profile
// @desc    Test route
// @access  public
router.get("/", (req, res) => res.send("Profile route"));

// @route   GET api/profile/me
// @desc    Get a profile based on the user id in the token
// @access  private
router.get("/me", auth, async (req, res) => {
  try {
    // find profile based on user id in request
    // populate name and avatar from user schema.
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res
        .status(400)
        .json({ msg: "There is no profile for this user." });
    }
    res.json(profile); // if there is user
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/profile/
// @desc    Create or update a user profile
// @access  private
router.post(
  "/",
  [
    auth, // using auth middleware, this requires token to be sent in the Headers
    [
      // set up validation rules
      check("status", "Status is required.").not().isEmpty(),
      check("skills", "Skills is required.").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    try {
      // collect possible errors generated by the rules
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin,
      } = req.body;

      // Build a profile Object
      const profileFields = {};
      profileFields.user = req.user.id;
      // Set fields of the profile object based on what we send in request body
      if (company) profileFields.company = company;
      if (website) profileFields.website = website;
      if (location) profileFields.location = location;
      if (bio) profileFields.bio = bio;
      if (status) profileFields.status = status;
      if (githubusername) profileFields.githubusername = githubusername;
      if (skills) {
        profileFields.skills = skills.split(",").map((skill) => skill.trim()); // turn a string into an array, comma separated
      }
      console.log(profileFields.skills);

      // Build a social Object
      /* Social is not a "direct" field of profile object like the ones above, but an object itself
      // This is why we need to set it in a different matter. */
      profileFields.social = {};
      if (youtube) profileFields.social.youtube = youtube;
      if (twitter) profileFields.social.twitter = twitter;
      if (instagram) profileFields.social.instagram = instagram;
      if (linkedin) profileFields.social.linkedin = linkedin;
      if (facebook) profileFields.social.facebook = facebook;

      try {
        let profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
          // update
          profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          );

          return res.json(profile);
        }

        // else, create
        profile = new Profile(profileFields);
        await profile.save();
        return res.json(profile);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  public
router.get("/all", async (req, res) => {
  try {
    // find profile based on user id in request
    // populate name and avatar from user schema.
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    if (!profiles) {
      return res
        .status(400)
        .json({ msg: "There is no profile for this user." });
    }
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user id
// @access  public
router.get("/user/:user_id", async (req, res) => {
  try {
    // find profile based on user id in request
    // populate name and avatar from user schema.
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "Profile not found." });
    }
    res.json(profile); // if there is user
  } catch (error) {
    console.error(error.message);
    if (error.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found." });
    }
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/profile/delete
// @desc    Delete a user and profile
// @access  private
router.delete("/delete", auth, async (req, res) => {
  try {
    // Remove profile
    await Profile.findOneAndDelete({ user: req.user.id });
    // Remove user
    await User.findOneAndDelete({ _id: req.user.id });
    res.json({ msg: "User deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  private
router.put(
  "/experience",
  auth,
  [
    // set up validation rules
    check("title", "Title is required.").not().isEmpty(),
    check("company", "Company is required.").not().isEmpty(),
    check("from", "Date from is required.").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      // collect possible errors generated by the rules
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // first find the profile based on the user id from the request
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        // if profile is not found
        return res
          .status(400)
          .json({ msg: "There is no profile for this user." });
      }
      // if profile is found, do the rest
      const { title, location, company, from, to, current, description } =
        req.body;
      const newExp = {
        title,
        location,
        company,
        from,
        to,
        current,
        description,
      };
      profile.experience.unshift(newExp);
      await profile.save();
      return res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Remove profile experience
// @access  private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    // Find profile
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.experience
      .map((exp) => exp.id)
      .indexOf(req.params.exp_id);
    // Remove the element at that index (experience can be an array of items)
    profile.experience.splice(removeIndex, 1);
    await profile.save(); // save the profile after removing
    res.json(profile); // return the updated
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  private
router.put(
  "/education",
  auth,
  [
    // set up validation rules
    check("school", "School is required.").not().isEmpty(),
    check("degree", "Degree is required.").not().isEmpty(),
    check("fieldofstudy", "Field of study from is required.").not().isEmpty(),
    check("from", "Date from is required.").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      // collect possible errors generated by the rules
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // first find the profile based on the user id from the request
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        // if profile is not found
        return res
          .status(400)
          .json({ msg: "There is no profile for this user." });
      }
      const { school, degree, fieldofstudy, from, to, current, description } =
        req.body;

      const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
      };
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Remove profile education
// @access  private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    // Find profile
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.education
      .map((edu) => edu.id)
      .indexOf(req.params.edu_id);
    // Remove the element at that index (education can be an array of items)
    profile.education.splice(removeIndex, 1);
    await profile.save(); // save the profile after removing
    res.json(profile); // return the updated
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
