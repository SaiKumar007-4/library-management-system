/**
 * Email validation
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Password validation (minimum 6 characters)
 */
export const isValidPassword = (password) => {
    return password && password.length >= 6;
};

/**
 * Check if ID is a valid MongoDB ObjectId
 */
export const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Check if quantity is valid (non-negative number)
 */
export const isValidQuantity = (quantity) => {
    return Number.isInteger(quantity) && quantity >= 0;
};
