/**
 * Base configuration for the Briq SDK
 */
export interface BriqConfig {
    apiKey: string;
    baseUrl?: string;
    timeout?: number;
    retries?: number;
    version?: string;
}

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    timestamp?: string;
}

/**
 * Base error response structure
 */
export interface ApiError {
    success: false;
    error: string;
    message?: string;
    code?: string | number;
    details?: Record<string, any>;
}

/**
 * HTTP methods supported by the API
 */
export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

/**
 * Request configuration for HTTP calls
 */
export interface RequestConfig {
    method: HttpMethod;
    url: string;
    headers?: Record<string, string>;
    data?: any;
    params?: Record<string, any>;
    timeout?: number;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
    page?: number;
    limit?: number;
    offset?: number;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

/**
 * Base entity with common fields
 */
export interface BaseEntity {
    id: string;
    created_at?: string;
}

/**
 * API endpoints structure
 */
export interface ApiEndpoints {
    readonly messages: {
        readonly sendInstant: string;
        readonly sendCampaign: string;
        readonly logs: string;
        readonly history: string;
    };
    readonly workspaces: {
        readonly create: string;
        readonly getAll: string;
        readonly getById: (id: string) => string;
        readonly update: (id: string) => string;
    };
    readonly campaigns: {
        readonly create: string;
        readonly getAll: string;
        readonly getById: (id: string) => string;
        readonly update: (id: string) => string;
    };
}

/**
 * SDK operation status
 */
export type OperationStatus = 'pending' | 'success' | 'failed' | 'cancelled';

/**
 * Retry configuration
 */
export interface RetryConfig {
    maxRetries: number;
    retryDelay: number;
    retryCondition?: (error: any) => boolean;
}