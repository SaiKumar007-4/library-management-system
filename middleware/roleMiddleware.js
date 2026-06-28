import { Router } from 'express';

const router = Router();

// Role-based authorization middleware
router.use((req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Please log in to access this route.',
        });
    }
    next();
});

// Librarian authorization
export const authorizeLibrarian = (req, res, next) => {
    if (req.user.role !== 'librarian') {
        return res.status(403).json({
            success: false,
            message: 'Only librarians can access this route.',
        });
    }
    next();
};

// Member authorization
export const authorizeMember = (req, res, next) => {
    if (req.user.role !== 'member') {
        return res.status(403).json({
            success: false,
            message: 'Only members can access this route.',
        });
    }
    next();
};

export default router;
