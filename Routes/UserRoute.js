import express from "express"

import { getUser, updateUser ,deleteUser, followUser,UnFollowUser,getAllUsers, searchUser} from "../Controllers/UserController.js";
import authMiddleWare from "../MiddleWare/authMiddleWare.js";
const router=express.Router()

router.get('/',getAllUsers)
router.get('/search/:key',authMiddleWare,searchUser)
router.get('/:id',getUser)
router.put('/:id',authMiddleWare ,updateUser)
router.delete('/:id',authMiddleWare,deleteUser)
router.put('/:id/follow' ,authMiddleWare,followUser)
router.put('/:id/UnFollow' ,authMiddleWare,UnFollowUser)




export default router;