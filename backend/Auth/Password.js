
function validatePassword(password, {
  minLen = 8,
  requireUpper = true,
  requireLower = true,
  requireDigit = true,
  requireSpecial = true,
} = {}) {
  const errors = [];

  if (typeof password !== 'string') {
    errors.push('Password must be a string.');
    return { valid: false, errors };
  }

  if (password.length < minLen) {
    errors.push(`Password must be at least ${minLen} characters long.`);
  }

  if (requireUpper && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter.');
  }

  if (requireLower && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter.');
  }

  if (requireDigit && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one digit.');
  }
  if (requireSpecial && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password)) {
    errors.push('Password must contain at least one special character (e.g. !@#$%).');
  }
  if (/\s/.test(password)) {
    errors.push('Password must not contain spaces.');
  }

  return { valid: errors.length === 0, errors };
}

export { validatePassword };
