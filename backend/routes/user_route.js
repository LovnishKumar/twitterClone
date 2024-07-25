const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const UserModel = mongoose.model("UserModel");
const PostModel = mongoose.model("PostModel");
const { JWT_SECRET } = require("../config");
const protectedRoute = require("../middleware/protectedResource");

//Api For Signup user
router.post("/signup", (req, res) => {
  const { fullName, email, password, profileImg } = req.body;
  if (!fullName || !password || !email) {
    return res
      .status(400)
      .json({ error: "One or more mandatory fields are empty" });
  }
  UserModel.findOne({ email: email })
    .then((userInDB) => {
      if (userInDB) {
        return res
          .status(500)
          .json({ error: "User with this email already registered" });
      }
      bcryptjs
        .hash(password, 16)
        .then((hashedPassword) => {
          const user = new UserModel({
            fullName,
            email,
            password: hashedPassword,
            profileImg,
          });
          user
            .save()
            .then((newUser) => {
              res.status(201).json({ result: "User Signed up Successfully!" });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

//Api for login user
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!password || !email) {
    return res
      .status(400)
      .json({ error: "One or more mandatory fields are empty" });
  }
  UserModel.findOne({ email: email })
    .then((userInDB) => {
      if (!userInDB) {
        return res.status(401).json({ error: "Invalid Credentials" });
      }
      bcryptjs
        .compare(password, userInDB.password)
        .then((didMatch) => {
          if (didMatch) {
            const jwtToken = jwt.sign({ _id: userInDB._id }, JWT_SECRET);
            const userInfo = {
              _id: userInDB._id,
              email: userInDB.email,
              fullName: userInDB.fullName,
            };
            res
              .status(200)
              .json({ result: { token: jwtToken, user: userInfo } });
          } else {
            return res.status(401).json({ error: "Invalid Credentials" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

//Api for get a specific user post
router.get("/userposts/:userId", protectedRoute, async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("User ID for Posts:", userId);

    const userPosts = await PostModel.find({ author: userId })
      .select("description image createdAt likes")
      .populate({
        path: "author",
        select: "fullName email profileImageUrl",
      })
      .populate({
        path: "comments",
        select: "commentText commentedBy createdAt",
        populate: {
          path: "commentedBy",
          select: "fullName email profileImageUrl",
        },
      })
      .populate({
        path: "likes",
        select: "likedBy ",
        populate: {
          path: "likedBy",
          select: "fullName email profileImageUrl",
        },
      });

    res.json({ posts: userPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Api for get the profile of user who loged in
router.get("/myprofile", protectedRoute, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId)
      .populate("followers", "fullName")
      .populate("following", "fullName");

    const userProfile = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profileImageUrl: user.profileImageUrl,
      followers: user.followers.length,
      following: user.following.length,
    };

    res.json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Api for get a specific user profile
router.get("/user/:id", protectedRoute, async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("User ID:", userId);
    const user = await UserModel.findById(userId)
      .select("-password")
      .populate({
        path: "posts",
        select: "title content createdAt",
      })
      .populate({
        path: "following",
        select: "fullName email profileImg",
      })
      .populate({
        path: "followers",
        select: "fullName email profileImg",
      });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Api for follow a user
router.post("/follow/:userId", protectedRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    const followUserId = req.params.userId;

    if (userId.toString() === followUserId.toString()) {
      return res.status(400).json({ error: "Cannot follow yourself" });
    }

    const user = await UserModel.findById(userId);
    const followUser = await UserModel.findById(followUserId);

    if (!user || !followUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.following.includes(followUserId)) {
      return res.status(400).json({ error: "Already following this user" });
    }

    user.following.push(followUserId);
    await user.save();

    followUser.followers.push(userId);
    await followUser.save();

    res.json({ message: "User followed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Api for unfollow a user
router.post("/unfollow/:userId", protectedRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    const unfollowUserId = req.params.userId;

    if (userId.toString() === unfollowUserId.toString()) {
      return res.status(400).json({ error: "Cannot unfollow yourself" });
    }

    const user = await UserModel.findById(userId);
    const unfollowUser = await UserModel.findById(unfollowUserId);

    if (!user || !unfollowUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.following.includes(unfollowUserId)) {
      return res.status(400).json({ error: "Not following this user" });
    }

    user.following = user.following.filter(
      (id) => id.toString() !== unfollowUserId.toString()
    );
    await user.save();

    unfollowUser.followers = unfollowUser.followers.filter(
      (id) => id.toString() !== userId.toString()
    );
    await unfollowUser.save();

    res.json({ message: "User unfollowed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Api for checking followers
router.get("/checkfollow/:userId", protectedRoute, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const followUserId = req.params.userId;

    const user = await UserModel.findById(loggedInUserId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isFollowing = user.following.includes(followUserId);

    res.json({ following: isFollowing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
