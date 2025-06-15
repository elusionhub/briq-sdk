import type {
    BriqConfig,
    RequestConfig,
    ApiResponse,
} from '../types/common';

/**
 * Abstract base client for HTTP operations
 */
export abstract class BaseClient {
    protected readonly config: Required<BriqConfig>;
    protected readonly defaultHeaders: Record<string, string>;

    constructor(config: BriqConfig) {
        this.config = {
            baseUrl: 'https://karibu.briq.tz',
            timeout: 30000,
            retries: 3,
            version: 'v1',
            ...config
        };

        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'X-API-Key': this.config.apiKey,
            'User-Agent': 'Briq-SDK-TS/1.0.0'
        };
    }

    /**
     * Make HTTP request with automatic error handling
     */
    protected async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
        const url = this.buildUrl(config.url);
        const headers = { ...this.defaultHeaders, ...config.headers };
        
        try {
            const response = await this.executeRequest({
                ...config,
                url,
                headers
            });

            return this.handleResponse<T>(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Build complete URL with base URL and version
     */
    private buildUrl(endpoint: string): string {
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
        return `${this.config.baseUrl}/${this.config.version}/${cleanEndpoint}`;
    }

    /**
     * Execute the actual HTTP request
     */
    protected abstract executeRequest(config: RequestConfig): Promise<any>;

    /**
     * Handle successful response
     */
    protected abstract handleResponse<T>(response: any): Promise<ApiResponse<T>>;

    /**
     * Handle request errors
     */
    protected abstract handleError(error: any): Error;

    /**
     * Convenience methods for different HTTP verbs
     */
    public async get<T>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
        return this.request<T>({ method: 'GET', url, ...config });
    }

    public async post<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
        return this.request<T>({ method: 'POST', url, data, ...config });
    }

    public async patch<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
        return this.request<T>({ method: 'PATCH', url, data, ...config });
    }

    public async put<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
        return this.request<T>({ method: 'PUT', url, data, ...config });
    }

    public async delete<T>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
        return this.request<T>({ method: 'DELETE', url, ...config });
    }
}