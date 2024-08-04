// set up user routes
import express from 'express';
const router = express.Router();
import { getUser, updateUser } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

router.get('/', authenticateToken, getUser);
router.put('/', authenticateToken, updateUser);
router.patch('/addContact', authenticateToken, addContact);
router.patch('/addPlace', authenticateToken, addPlace);
router.patch('/addLocation', authenticateToken, addLocation);
router.delete('/:index', authenticateToken, removeContact);

export default router;