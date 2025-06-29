"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUDSMEmail = void 0;
// Utility to validate UDSM email addresses
function validateUDSMEmail(email) {
    const udsmEmailRegex = /^[a-zA-Z0-9._%+-]+@udsm\.ac\.tz$/i;
    if (!email) {
        return { isValid: false, message: 'Email is required' };
    }
    if (!udsmEmailRegex.test(email)) {
        return { isValid: false, message: 'Invalid UDSM email address' };
    }
    return { isValid: true };
}
exports.validateUDSMEmail = validateUDSMEmail;
