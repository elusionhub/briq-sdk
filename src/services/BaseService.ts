import type { BaseClient } from "@client/BaseClient";

/**
 * Abstract base service class
 */
export abstract class BaseService {
    protected readonly client: BaseClient;

    constructor(client: BaseClient) {
        this.client = client;
    }

    /**
     * Validate required parameters
     */
    protected validateRequired(params: Record<string, any>, requiredFields: string[]): void {
        const missing = requiredFields.filter(field => {
            const value = params[field];
            return value === undefined || value === null || value === '';
        });

        if (missing.length > 0) {
            throw new Error(`Missing required parameters: ${missing.join(', ')}`);
        }
    }

    /**
     * Sanitize and validate input data
     */
    protected sanitizeInput<T>(input: T): T {
        if (typeof input === 'object' && input !== null) {
            const sanitized = {} as T;
            for (const [key, value] of Object.entries(input)) {
                if (value !== undefined) {
                    if (typeof value === 'string') {
                        (sanitized as any)[key] = value.trim();
                    } else {
                        (sanitized as any)[key] = value;
                    }
                }
            }
            return sanitized;
        }
        return input;
    }

    /**
     * Format error message for end users
     */
    protected formatError(error: any): string {
        if (error.response?.data?.message) {
            return error.response.data.message;
        }
        if (error.message) {
            return error.message;
        }
        return 'An unexpected error occurred';
    }
}