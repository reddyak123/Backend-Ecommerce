// Email validation function
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Username validation function
  const isValidUsername = (username) => {
    // Username should:
    // - Be between 3 and 30 characters
    // - Start with letter
    // - Contain only letters, numbers, underscores, or hyphens
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{2,29}$/;
    return usernameRegex.test(username);
  };
  
  const isValidPassword = (password) => {
    // Check if password is at least 8 characters long
    if (password.length < 8) {
      return false;
    }
  
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return false;
    }
  
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return false;
    }
  
    // Check for at least one digit
    if (!/\d/.test(password)) {
      return false;
    }
  
    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return false;
    }
  
    return true;
  };

module.exports = { isValidEmail, isValidUsername, isValidPassword};
