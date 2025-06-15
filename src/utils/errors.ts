/**
 * Base Briq SDK Error
 */
export abstract class BriqError extends Error {
    public readonly code: string;
    public readonly statusCode?: number;
    public readonly details?: Record<string, any>;

    constructor(
        message: string,
        code: string,
        statusCode?: number,
        details?: Record<string, any>
    ) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

/**
 * Authentication related errors
 */
export class AuthenticationError extends BriqError {
    constructor(message = 'Authentication failed', details?: Record<string, any>) {
        super(message, 'AUTHENTICATION_ERROR', 401, details);
    }
}

/**
 * Authorization related errors
 */
export class AuthorizationError extends BriqError {
    constructor(message = 'Insufficient permissions', details?: Record<string, any>) {
        super(message, 'AUTHORIZATION_ERROR', 403, details);
    }
}

/**
 * Validation errors for input data
 */
export class ValidationError extends BriqError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, 'VALIDATION_ERROR', 400, details);
    }
}

/**
 * Resource not found errors
 */
export class NotFoundError extends BriqError {
    constructor(resource: string, id?: string) {
        const message = id ? `${resource} with ID '${id}' not found` : `${resource} not found`;
        super(message, 'NOT_FOUND_ERROR', 404, { resource, id });
    }
}

/**
 * Rate limiting errors
 */
export class RateLimitError extends BriqError {
    constructor(message = 'Rate limit exceeded', retryAfter?: number) {
        super(message, 'RATE_LIMIT_ERROR', 429, { retryAfter });
    }
}

/**
 * Network/connectivity errors
 */
export class NetworkError extends BriqError {
    constructor(message = 'Network error occurred', details?: Record<string, any>) {
        super(message, 'NETWORK_ERROR', undefined, details);
    }
}

/**
 * Server errors (5xx)
 */
export class ServerError extends BriqError {
    constructor(message = 'Internal server error', statusCode = 500, details?: Record<string, any>) {
        super(message, 'SERVER_ERROR', statusCode, details);
    }
}

/**
 * Configuration errors
 */
export class ConfigurationError extends BriqError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, 'CONFIGURATION_ERROR', undefined, details);
    }
}

/**
 * Timeout errors
 */
export class TimeoutError extends BriqError {
    constructor(timeout: number) {
        super(`Request timed out after ${timeout}ms`, 'TIMEOUT_ERROR', 408, { timeout });
    }
}