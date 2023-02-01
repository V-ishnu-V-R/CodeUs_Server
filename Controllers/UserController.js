import UserModel from "../Models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//getAll users
export const getAllUsers = async (req, res) => {
  try {
    let users = await UserModel.find();
    users = users.map((users) => {
      const { password, ...otherDetails } = users._doc;
      return otherDetails;
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

//gettin a user

export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);
    if (user) {
      const { password, ...otherDeatails } = user._doc;
      res.status(200).json(otherDeatails);
    } else {
      res.status(404).json("no such user");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
// update an user

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { _id, currentUserAdminStatus, password } = req.body;
  if (id === _id) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      const token = jwt.sign(
        {
          username: user.username,
          id: user._id,
        },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({ user, token });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("acess denied");
  }
};
//Delete user
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus } = req.body;
  if (currentUserId === id || currentUserAdminStatus) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("user deleted succedfully");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("acess denied");
  }
};
//Follow user
export const followUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  if (_id === id) {
    res.status(403).json("Action forbidden");
  } else
    try {
      const followUser = await UserModel.findById(id); //user whom we want to follow
      const followingUser = await UserModel.findById(_id); //this is the  user followint the above user
      if (!followUser.followers.includes(_id)) {
        await followUser.updateOne({ $push: { followers: _id } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("User followed");
      } else {
        res.status(403).json("User is already followed");
      }
    } catch (error) {
      res.status(500).json(error);
    }
};
//UNFollow user
export const UnFollowUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  if (_id === id) {
    res.status(403).json("Action forbidden");
  } else
    try {
      const followUser = await UserModel.findById(id); //user whom we want to follow
      const followingUser = await UserModel.findById(_id); //this is the  user followint the above user
      if (followUser.followers.includes(_id)) {
        await followUser.updateOne({ $pull: { followers: _id } });
        await followingUser.updateOne({ $pull: { following: id } });
        res.status(200).json("User Unfollowed");
      } else {
        res.status(403).json("User not followed by you");
      }
    } catch (error) {
      res.status(500).json(error);
    }
};
//

export const searchUser = async (req, res) => {
  let key = req.params.key;
  try {
    const searchUser = await UserModel.find({
      $or: [
        { firstname: { $regex: key, $options: "si" } },
        { lastname: { $regex: key, $options: "si" } },
        { username: { $regex: key, $options: "si" } },
      ],
    });
    console.log(searchUser,'search user');
    res.status(200).json(searchUser);
  } catch (error) {
    res.status(500).json(error);
  }
};
