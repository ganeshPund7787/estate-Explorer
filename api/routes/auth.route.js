import express from "express";
import { GoogleAuth, signIn, signUp } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/googleAuth", GoogleAuth);

export default router;