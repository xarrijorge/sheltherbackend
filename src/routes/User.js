import express from 'express'
import {
  registerUser,
  completeUserProfile,
  verifyOtp,
  loginUser,
} from '../controllers/userController.js'

const router = express.Router()

// Route for user registration
router.post('/register', registerUser)

// Define the route for OTP verification
router.post('/verify-otp', verifyOtp);

// Route for completing user profile
router.post('/complete-profile', completeUserProfile)

// Route for user login
router.post('/login', loginUser)

export default router
