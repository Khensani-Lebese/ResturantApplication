export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'Email is required';
  }
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email';
  }
  return '';
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let errorMessage = [];
  
  if (password.length < minLength) {
    errorMessage.push(`At least ${minLength} characters`);
  }
  if (!hasUpperCase) {
    errorMessage.push('One uppercase letter');
  }
  if (!hasLowerCase) {
    errorMessage.push('One lowercase letter');
  }
  if (!hasNumbers) {
    errorMessage.push('One number');
  }
  if (!hasSpecialChar) {
    errorMessage.push('One special character');
  }

  if (errorMessage.length > 0) {
    return 'Password must contain: ' + errorMessage.join(', ');
  }
  return '';
};

export const validateName = (name) => {
  if (!name) {
    return 'Name is required';
  }
  if (name.length < 2) {
    return 'Name must be at least 2 characters';
  }
  return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (confirmPassword !== password) {
    return 'Passwords do not match';
  }
  return '';
}; 