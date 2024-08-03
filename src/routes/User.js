import express from 'express'
import {
  registerUser,
  completeUserProfile,
  loginUser,
} from '../controllers/userController.js'

const router = express.Router()

// Route for user registration
router.post('/register', registerUser)

// Route for completing user profile
router.post('/complete-profile', completeUserProfile)

// Route for user login
router.post('/login', loginUser)

export default router
