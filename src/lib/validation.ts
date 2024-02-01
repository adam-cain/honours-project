import { ValidationResult } from "@/lib/types";

export const validatePassword = (password: string): ValidationResult => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let errorMessage = [];

    if (password.length < minLength) {
        errorMessage.push("at least 8 characters");
    }
    if (!hasUpperCase) {
        errorMessage.push("a uppercase letter");
    }
    if (!hasLowerCase) {
        errorMessage.push("a lowercase letter");
    }
    if (!hasNumbers) {
        errorMessage.push("a number");
    }
    if (!hasSpecialChar) {
        errorMessage.push("a special character");
    }

    return {
        isValid: errorMessage.length === 0,
        errorMessage: errorMessage.length > 0 ? errorBuilder(errorMessage) : "",
    };
};

export const validateEmail = (email: string): ValidationResult => {
    const emailPattern = /\S+@\S+\.\S+/;
    const isValid = emailPattern.test(email);
    return {
        isValid: isValid,
        errorMessage: isValid ? "": "Invalid email address",
    };
};

export const validateUsername = (username: string): ValidationResult => {
    const validCharacters = /^[a-zA-Z0-9_]*$/.test(username);
    let errorMessage = [];

    if(username.length < 4) {
        errorMessage.push("at least 4 characters");
    }
    if(username.length > 20) {
        errorMessage.push("at most 20 characters");
    }if(!validCharacters) {
        errorMessage.push("only letters, numbers, and underscores");
    }

    return {
        isValid: errorMessage.length === 0,
        errorMessage: errorMessage.length > 0 ? errorBuilder(errorMessage) : "",
    };
};

function errorBuilder(errors: string[]) {
    return `Must include ${errors.join(", ")}.`;
}