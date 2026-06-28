import { Router } from 'express';
import * as bookController from '../controllers/bookController.js';
import authenticate from '../middleware/authMiddleware.js';

const router = Router();

// GET /books - Get all books (public)
router.get('/', bookController.getAllBooks);

// POST /books - Add a new book (librarian only)
router.post('/', authenticate, async (req, res, next) => {
    if (req.user.role !== 'librarian') {
        return res.status(403).json({ success: false, message: 'Only librarians can add books.' });
    }
    next();
}, bookController.addBook);

// POST /books/:id/borrow - Borrow a book (member only) - MUST be before /:id routes
router.post('/:id/borrow', authenticate, async (req, res, next) => {
    if (req.user.role !== 'member') {
        return res.status(403).json({ success: false, message: 'Only members can borrow books.' });
    }
    next();
}, bookController.borrowBook);

// POST /books/:id/return - Return a book (member only) - MUST be before /:id routes
router.post('/:id/return', authenticate, async (req, res, next) => {
    if (req.user.role !== 'member') {
        return res.status(403).json({ success: false, message: 'Only members can return books.' });
    }
    next();
}, bookController.returnBook);

// GET /books/:id - Get a specific book (public)
router.get('/:id', bookController.getBook);

// PUT /books/:id - Update a book (librarian only)
router.put('/:id', authenticate, async (req, res, next) => {
    if (req.user.role !== 'librarian') {
        return res.status(403).json({ success: false, message: 'Only librarians can update books.' });
    }
    next();
}, bookController.updateBook);

// DELETE /books/:id - Delete a book (librarian only)
router.delete('/:id', authenticate, async (req, res, next) => {
    if (req.user.role !== 'librarian') {
        return res.status(403).json({ success: false, message: 'Only librarians can delete books.' });
    }
    next();
}, bookController.deleteBook);

export default router;
