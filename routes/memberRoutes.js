import { Router } from 'express';
import * as memberController from '../controllers/memberController.js';
import authenticate from '../middleware/authMiddleware.js';

const router = Router();

// GET /members/me/books - Get my borrowed books (member only) - MUST be before /:id
router.get('/me/books', authenticate, async (req, res, next) => {
    if (req.user.role !== 'member') {
        return res.status(403).json({ success: false, message: 'Only members can access this route.' });
    }
    next();
}, memberController.getMyBooks);

// GET /members - Get all members (librarian only)
router.get('/', authenticate, async (req, res, next) => {
    if (req.user.role !== 'librarian') {
        return res.status(403).json({ success: false, message: 'Only librarians can access this route.' });
    }
    next();
}, memberController.getAllMembers);

// DELETE /members/:id - Delete a member (librarian only)
router.delete('/:id', authenticate, async (req, res, next) => {
    if (req.user.role !== 'librarian') {
        return res.status(403).json({ success: false, message: 'Only librarians can delete members.' });
    }
    next();
}, memberController.deleteMember);

export default router;
