import User from '../models/User.js';
import { generateToken } from '../utils/jwtUtils.js';
import { isValidEmail } from '../utils/validationUtils.js';

/**
 * Register a new user (Members only)
 * Users can ONLY register as Member role.
 * Librarian accounts must be inserted directly into the database.
 */
export const register = async (name, email, password) => {
    // Validation
    if (!name || !email || !password) {
        const error = new Error('Name, email, and password are required.');
        error.statusCode = 400;
        throw error;
    }

    if (!isValidEmail(email)) {
        const error = new Error('Please provide a valid email address.');
        error.statusCode = 400;
        throw error;
    }

    if (password.length < 6) {
        const error = new Error('Password must be at least 6 characters.');
        error.statusCode = 400;
        throw error;
    }

    // Check if user already exists (duplicate email)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error('Email is already registered.');
        error.statusCode = 409;
        throw error;
    }

    // Create new user (ALWAYS as member, never as librarian)
    const newUser = new User({
        name,
        email,
        password,
        role: 'member',
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id, newUser.role);

    return {
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        },
        token,
    };
};

/**
 * Login user with email and password
 */
export const emailLogin = async (email, password) => {
    // Validation
    if (!email || !password) {
        const error = new Error('Email and password are required.');
        error.statusCode = 400;
        throw error;
    }

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        const error = new Error('Invalid email or password.');
        error.statusCode = 401;
        throw error;
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        const error = new Error('Invalid email or password.');
        error.statusCode = 401;
        throw error;
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    };
};

/**
 * Get user profile
 */
export const getUserProfile = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        const error = new Error('User not found.');
        error.statusCode = 404;
        throw error;
    }
    return user;
};
