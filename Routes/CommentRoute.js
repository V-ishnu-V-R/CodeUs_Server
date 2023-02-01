import express from "express";

import { createComment, getComment } from "../Controllers/CommentController.js";
import authMiddleWare from "../MiddleWare/authMiddleWare.js";
const router = express.Router();
router.use(authMiddleWare);
router.post('/:id', createComment);
router.get('/:id', getComment);
export default router
