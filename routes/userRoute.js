import express from "express";
import { registerUser, getUser } from "../controllers/userController.js"

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/user").get(getUser);

export default router;
