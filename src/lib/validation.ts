type PasswordValidationResult = {
    isValid: boolean;
    errorMessage: string;
};

export const validatePassword = (password: string): PasswordValidationResult => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let errorMessage = [];

    if (password.length < minLength) {
        errorMessage.push('at least 8 characters');
    }
    if (!hasUpperCase) {
        errorMessage.push('a uppercase letter');
    }
    if (!hasLowerCase) {
        errorMessage.push('a lowercase letter');
    }
    if (!hasNumbers) {
        errorMessage.push('a number');
    }
    if (!hasSpecialChar) {
        errorMessage.push('a special character');
    }

    return {
        isValid: errorMessage.length === 0,
        errorMessage: errorMessage.length > 0 ? `Must include ${errorMessage.join(', ')}.` : '',
    };
};


export const validateEmail = (email: string) => {
    const emailPattern = /\S+@\S+\.\S+/;
    return emailPattern.test(email);
};