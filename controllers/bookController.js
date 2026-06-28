import Book from '../models/Book.js';
import Borrow from '../models/Borrow.js';

/**
 * Get all books (with search, filter, and pagination)
 */
export const getAllBooks = async (req, res, next) => {
    try {
        const { search, category, page = 1, limit = 10 } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
            ];
        }

        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        const total = await Book.countDocuments(query);
        const books = await Book.find(query).skip(skip).limit(limitNum);

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
 * Get a specific book by ID
 */
export const getBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found.' });
        }

        return res.json({ success: true, data: book });
    } catch (error) {
        next(error);
    }
};

/**
 * Add a new book (librarian only)
 */
export const addBook = async (req, res, next) => {
    try {
        const { title, author, isbn, category, quantity, description } = req.body;

        // Validate required fields
        if (!title || !author || !isbn || !category || quantity === undefined) {
            return res.status(400).json({ success: false, message: 'All required fields must be provided.' });
        }

        // Validate quantity is not negative
        if (quantity < 0) {
            return res.status(400).json({ success: false, message: 'Quantity cannot be negative.' });
        }

        const existingBook = await Book.findOne({ isbn });
        if (existingBook) {
            return res.status(409).json({ success: false, message: 'ISBN already exists.' });
        }

        const newBook = new Book({
            title,
            author,
            isbn,
            category,
            quantity,
            availableQuantity: quantity,
            description: description || '',
        });

        await newBook.save();
        return res.status(201).json({ success: true, data: newBook });
    } catch (error) {
        next(error);
    }
};

/**
 * Update a book (librarian only)
 */
export const updateBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Validate quantity if provided
        if (updates.quantity !== undefined && updates.quantity < 0) {
            return res.status(400).json({ success: false, message: 'Quantity cannot be negative.' });
        }

        const book = await Book.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found.' });
        }

        return res.json({ success: true, data: book });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete a book (librarian only)
 */
export const deleteBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await Book.findByIdAndDelete(id);

        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found.' });
        }

        return res.json({ success: true, data: { message: 'Book deleted successfully.' } });
    } catch (error) {
        next(error);
    }
};

/**
 * Borrow a book (member only)
 */
export const borrowBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const memberId = req.user._id;

        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found.' });
        }

        if (book.availableQuantity <= 0) {
            return res.status(400).json({ success: false, message: 'Book is not available.' });
        }

        const existingBorrow = await Borrow.findOne({ memberId, bookId: id, status: 'borrowed' });
        if (existingBorrow) {
            return res.status(409).json({ success: false, message: 'You already borrowed this book.' });
        }

        const newBorrow = new Borrow({
            memberId,
            bookId: id,
        });

        await newBorrow.save();
        book.availableQuantity -= 1;
        await book.save();

        return res.status(201).json({ success: true, data: newBorrow });
    } catch (error) {
        next(error);
    }
};

/**
 * Return a book (member only)
 */
export const returnBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const memberId = req.user._id;

        const borrow = await Borrow.findOne({ memberId, bookId: id, status: 'borrowed' });

        if (!borrow) {
            return res.status(404).json({ success: false, message: 'Borrow record not found.' });
        }

        borrow.returnDate = new Date();
        borrow.status = 'returned';
        await borrow.save();

        const book = await Book.findById(id);
        book.availableQuantity += 1;
        await book.save();

        return res.json({ success: true, data: borrow });
    } catch (error) {
        next(error);
    }
}