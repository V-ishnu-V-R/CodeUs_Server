import express from "express"
const router =express.Router()
import { CreatePost, DeletePost, GetPost, LikePost, TimelinePosts, UpdatePost } from "../Controllers/PostController.js";

router.post('/',CreatePost)
router.get('/:id' ,GetPost)
router.put('/:id' ,UpdatePost)
router.delete('/:id' ,DeletePost)
router.put('/:id/like' ,LikePost)
router.get('/:id/timeline',TimelinePosts)
export default router;
