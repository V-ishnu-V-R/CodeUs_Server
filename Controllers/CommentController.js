import CommentModel from "../Models/CommentModel.js";
export const createComment = async (req, res) => {
  const postId = req.params.id;

  const userId = req.body._id;

  try {
    const comment = new CommentModel({
      userId: userId,
      postId: postId,
      comment: req.body.comment,
    });
    await comment.save();
   
    res.status(200).json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const getComment = async (req, res) => {
  const postId = req.params.id;

  try {
    const response = await CommentModel.find({ postId: postId }).populate({
      path: "userId",
      select: { firstname: 1, lastname: 1 },
    });
    
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
