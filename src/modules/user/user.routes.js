import { Router } from "express";
import { addUser, getAllUsers, updateUser, deleteUser } from "./user.controller.js";

const userRouter = Router()

userRouter.route('/').post(addUser).get(getAllUsers)
userRouter.route('/:id').put(updateUser).delete(deleteUser)

export default userRouter