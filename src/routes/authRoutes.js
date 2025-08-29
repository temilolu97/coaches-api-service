import {Router} from 'express'
import { getProfile, login, registerCoach} from '../controllers/AuthController.js'
import { authenticateToken } from '../middlewares/authMiddleware.js'
const router = Router()

router.post("/register",registerCoach)
router.post("/login", login)
router.get("/profile",authenticateToken, getProfile)


export default router