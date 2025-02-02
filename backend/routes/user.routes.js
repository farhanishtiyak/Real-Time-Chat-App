import express from 'express';
import { getAllUsersForSidebar } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', getAllUsersForSidebar);

export default router;
