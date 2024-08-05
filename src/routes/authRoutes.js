import express from 'express'
import {
  registerUser,
  completeUserProfile,
  verifyOtp,
  loginUser,
  logoutUser,
  changePassword,
  forgotPassword
} from '../controllers/authController.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/verify', verifyOtp);
router.post('/complete', completeUserProfile)
router.post('/login', loginUser)
router.post('/logout', logoutUser);
router.post('/change', changePassword);
router.post('/forgot', forgotPassword);

export default router
