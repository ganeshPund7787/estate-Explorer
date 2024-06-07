import express from "express";
import { deleteUser, logoutUser, test, updateUser, getUserListing, getUser } from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.get('/test', test);

router.get('/logout', logoutUser);

router.route("/:id")
    .put(verifyUser, updateUser)
    .delete(verifyUser, deleteUser)

router.get("/listing/:id", verifyUser, getUserListing);
router.get("/:id", verifyUser, getUser)
export default router;