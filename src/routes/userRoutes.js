// set up user routes
import express from 'express';
const router = express.Router();
import { getUser, updateUser, addContact, addPlace, addLocation, removeContact } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

router.get('/', authenticateToken, getUser);
router.put('/', authenticateToken, updateUser);
router.patch('/addcontact', authenticateToken, addContact);
router.patch('/addplace', authenticateToken, addPlace);
router.patch('/addlocation', authenticateToken, addLocation);
router.delete('/:index', authenticateToken, removeContact);

export default router;