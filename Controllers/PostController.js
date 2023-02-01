import PostModel from "../Models/PostModel.js";
import UserModel from "../Models/UserModel.js";
import mongoose from "mongoose";

//Create new post
export const CreatePost = async (req, res) => {
  const newPost = new PostModel(req.body);
  try {
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json(error);
  }
};

//Get a post
export const GetPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await PostModel.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

//Update a post
export const UpdatePost = async (req, res) => {
  const PostId = req.params.id;
  const { userId } = req.body;
  try {
    const Post = await PostModel.findById(PostId);
    if (Post.userId === userId) {
      await Post.updateOne({ $set: req.body });
      res.status(200).json("Post Updated");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
//Delete a ppst
export const DeletePost = async (req, res) => {
  const PostId = req.params.id;
  const { userId } = req.body;
  try {
    const post = PostModel.findById(PostId);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("Post deleted successdfully");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//Like and dislike a post

export const LikePost = async (req, res) => {
  const PostId = req.params.id;
  const { userId } = req.body;
  try {
    const Post = await PostModel.findById(PostId);
    //like was a array of userid in model if a user likes an post the userid id included on the array of the like in that post
    if (!Post.likes.includes(userId)) {
      await Post.updateOne({ $push: { likes: userId } });
      res.status(200).json("Post liked");
    } else {
      await Post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Post Unliked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//timeline posts
export const TimelinePosts = async (req, res) => {
  //this timeline post includes the post the own as well as the following peeps post
  
  const userId = req.params.id;
  try {
    const CurrentUserPost = await PostModel.find({ userId: userId });
    const FollowingPost = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "FollowingPost",
        },
      },
      {
        $project: {
          FollowingPost: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json(
      CurrentUserPost.concat(...FollowingPost[0].FollowingPost).sort((a, b) => {
        return b.createdAt - a.createdAt;
      })
    );
  } catch (error) {
    res.status(500).json(error);
  }
};
