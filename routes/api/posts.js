const express = require("express");
const router = express.Router();
const Post = require("../../models/posts");
const passport = require("passport");
const validatePostInput = require("../../validation/post");

const convertPostToResponse = (post) => {
  return {
    id: post._id,
    title: post.title,
    body: post.body,
    author: post.author,
    date: post.date,
  };
};

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.find({ author: req.user.user_name })
      .then((posts) => res.status(200).json(posts.map(convertPostToResponse)))
      .catch((err) => {
        console.error(err);
        res
          .status(400)
          .json({ user: "Error fetching posts of logged in user" });
      });
  },
);

router.get("/:id", (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => res.status(200).json(convertPostToResponse(post)))
    .catch((err) => res.status(400).json({ id: "Error fetching post by id" }));
});

router.get("/author/:author", (req, res) => {
  Post.find({ author: req.params.author })
    .then((posts) => res.status(200).json(posts.map(convertPostToResponse)))
    .catch((err) =>
      res
        .status(400)
        .json({ author: "Error fetching posts of specific author" }),
    );
});

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const author = req.user.user_name;
    const post = req.body;
    const { value, error } = validatePostInput(post);
    if (error) {
      return res.status(400).json(error.message);
    }
    post.author = author;
    const newPost = new Post(post);
    newPost
      .save()
      .then((doc) => res.json(convertPostToResponse(doc)))
      .catch((err) =>
        res.status(400).json({ create: "Error creating new post" }),
      );
  },
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const author = req.user.user_name;
    const { value, error } = validatePostInput(req.body);
    if (error) {
      return res.status(400).json(error.message);
    }
    const { title, body } = req.body;
    Post.findOneAndUpdate(
      { author, _id: req.params.id },
      { $set: { title, body } },
      { new: true },
    )
      .then((doc) => res.status(200).json(convertPostToResponse(doc)))
      .catch((err) =>
        res.status(400).json({ update: "Error updating existing post" }),
      );
  },
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const author = req.user.user_name;
    Post.findOneAndDelete({ author, _id: req.params.id })
      .then((doc) => res.status(200).json(convertPostToResponse(doc)))
      .catch((err) => res.status(400).json({ delete: "Error deleting post" }));
  },
);

module.exports = router;
