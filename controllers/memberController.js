import User from '../models/User.js';
import Borrow from '../models/Borrow.js';

/**
 * Get all members (librarian only) with pagination
 */
export const getAllMembers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        const total = await User.countDocuments({ role: 'member' });
        const members = await User.find({ role: 'member' })
            .select('-password')
            .skip(skip)
            .limit(limitNum);

        return res.json({
            success: true,
            data: members,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get my borrowed books (member only) with pagination
 */
export const getMyBooks = async (req, res, next) => {
    try {
        const memberId = req.user._id;
        const { page = 1, limit = 10 } = req.query;

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        const total = await Borrow.countDocuments({ memberId });
        const borrowRecords = await Borrow.find({ memberId })
            .populate('bookId')
            .skip(skip)
            .limit(limitNum);

        const books = borrowRecords.map((record) => ({
            borrowId: record._id,
            bookId: record.bookId._id,
            title: record.bookId.title,
            author: record.bookId.author,
            borrowDate: record.borrowDate,
            dueDate: record.dueDate,
            returnDate: record.returnDate,
            status: record.status,
        }));

        return res.json({
            success: true,
            data: books,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete a member (librarian only)
 */
export const deleteMember = async (req, res, next) => {
    try {
        const { id } = req.params;
        const member = await User.findByIdAndDelete(id);

        if (!member) {
            return res.status(404).json({ success: false, message: 'Member not found.' });
        }

        // Also delete all borrow records for this member
        await Borrow.deleteMany({ memberId: id });

        return res.json({ success: true, data: { message: 'Member deleted successfully.' } });
    } catch (error) {
        next(error);
    }
}