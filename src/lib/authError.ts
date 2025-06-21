// src/lib/errors.ts

export class AuthError extends Error {
  constructor(message: string, public code: string = 'AUTH_ERROR') {
    super(message);
    this.name = 'AuthError'; // Good practice to set the name
  }
}

export class UserNotFoundError extends AuthError {
  constructor() {
    super("User not found", 'USER_NOT_FOUND');
    this.name = 'UserNotFoundError';
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super("Invalid credentials", 'INVALID_CREDENTIALS');
    this.name = 'InvalidCredentialsError';
  }
}

// Add more as needed, e.g., EmailNotVerifiedError, OAuthMismatchError, PasswordMissingError
export class EmailNotVerifiedError extends AuthError {
    constructor() {
        super("Please verify your email before signing in", "EMAIL_NOT_VERIFIED");
        this.name = "EmailNotVerifiedError";
    }
}
// ... etc.