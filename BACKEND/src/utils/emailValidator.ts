// Utility to validate UDSM email addresses
export function validateUDSMEmail(email: string): { isValid: boolean; message?: string } {
  const udsmEmailRegex = /^[a-zA-Z0-9._%+-]+@udsm\.ac\.tz$/i;
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  if (!udsmEmailRegex.test(email)) {
    return { isValid: false, message: 'Invalid UDSM email address' };
  }
  return { isValid: true };
}