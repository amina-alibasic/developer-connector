const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../config/models/user");
const Profile = require("../../config/models/Profile");
const Post = require("../../config/models/Post");
const auth = require("../../middleware/auth");

// @route   GET api/posts
// @desc    Test route
// @access  public
router.get("/", (req, res) => res.send("Posts route"));

// @route   POST api/posts
// @desc    Test route
// @access  private
router.post(
  "/",
  [auth, [check("text", "Text is required.").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/posts/all
// @desc    Get all posts
// @access  public
router.get("/all", async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); // sort by date desc
    if (!posts) {
      return res.status(400).json({ msg: "There is no posts." });
    }
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  public
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ msg: "The post doesn't exist." });
    }
    res.json(post);
  } catch (error) {
    console.error(error.message);
    if (error.kind == "ObjectId") {
      return res.status(400).json({ msg: "The post doesn't exist." });
    }
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ msg: "The post doesn't exist." });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(400).json({ msg: "User not authorized." });
    }
    await post.deleteOne();
    res.json({ msg: "Post removed." });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  private
router.put("/like/:id", auth, async (req, res) => {
  try {
    // first find the post
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ msg: "The post doesn't exist." });
    }

    // Check if post has already been liked by the logged in user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.json({ msg: "The post has already been liked." });
    }

    post.likes.unshift({ user: req.user.id }); // add (push) a like
    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    // first find the post
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ msg: "The post doesn't exist." });
    }

    // Check if there is a like to remove
    if (post.likes.length === 0) {
      return res.json({ msg: "The post has no likes to remove." });
    }

    // The user currently logged in can only remove their like, not others
    const findLike = post.likes.filter(
      (like) => like.user.toString() === req.user.id
    );
    if (findLike.length === 0) {
      return res
        .status(400)
        .json({ msg: "Post cannot be unliked as it wasn't previously liked." });
    }
    // Get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString()) // find the like of currently logegd in user
      .indexOf(req.user.id);
    // Remove the element at that index (likes is an array of items)
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
