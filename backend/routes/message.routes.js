import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import protectRoute from "../middlewares/protectRoute.js";
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;