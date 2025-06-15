import { BaseClient } from "./BaseClient";
import type { ApiResponse, BriqConfig, RequestConfig } from "../types/common";
import {
  AuthenticationError,
  AuthorizationError,
  BriqError,
  NetworkError,
  NotFoundError,
  RateLimitError,
  ServerError,
  TimeoutError,
  ValidationError,
} from "../utils/errors";
import { HTTP_STATUS, RETRY_CONFIG } from "../utils/constants";
import {
  calculateBackoffDelay,
  delay,
  isRetryableError,
} from "../utils/helpers";

/**
 * Logger interface for error tracking
 */
interface Logger {
  error(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  info(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
}

/**
 * Default console logger implementation
 */
class ConsoleLogger implements Logger {
  error(message: string, meta?: any): void {
    console.error(`[BRIQ-SDK-ERROR] ${message}`, meta || "");
  }

  warn(message: string, meta?: any): void {
    console.warn(`[BRIQ-SDK-WARN] ${message}`, meta || "");
  }

  info(message: string, meta?: any): void {
    console.info(`[BRIQ-SDK-INFO] ${message}`, meta || "");
  }

  debug(message: string, meta?: any): void {
    console.debug(`[BRIQ-SDK-DEBUG] ${message}`, meta || "");
  }
}

/**
 * Concrete HTTP client implementation using fetch API
 */
export class HttpClient extends BaseClient {
  private logger: Logger;

  constructor(config: BriqConfig & { logger?: Logger }) {
    super(config);
    this.logger = config.logger || new ConsoleLogger();
  }

  /**
   * Execute HTTP request with fetch API
   */
  protected async executeRequest(config: RequestConfig): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const fetchConfig: RequestInit = {
        method: config.method,
        signal: controller.signal,
      };

      if (config.headers) {
        fetchConfig.headers = config.headers;
      }

      if (config.data && config.method !== "GET") {
        fetchConfig.body = JSON.stringify(config.data);
      }

      let url = config.url;
      if (config.params && Object.keys(config.params).length > 0) {
        const searchParams = new URLSearchParams();
        Object.entries(config.params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        url += `?${searchParams.toString()}`;
      }

      const response = await fetch(url, fetchConfig);

      clearTimeout(timeoutId);

      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        const timeoutError = new TimeoutError(this.config.timeout);
        this.logger.error("Request timeout", {
          timeout: this.config.timeout,
          url: config.url,
          errorCode: timeoutError.code,
        });
        throw timeoutError;
      }

      const networkError = new NetworkError("Network request failed", {
        originalError: error.message,
      });
      throw networkError;
    }
  }

  /**
   * Handle successful response and parse JSON
   */
  protected async handleResponse<T>(
    response: Response,
  ): Promise<ApiResponse<T>> {
    let responseData: any;

    try {
      const text = await response.text();
      responseData = text ? JSON.parse(text) : {};
    } catch {
      throw new ServerError(
        "Invalid JSON response from server",
        response.status,
      );
    }

    if (response.ok) {
      if (responseData.success !== undefined) {
        return responseData as ApiResponse<T>;
      } else {
        return {
          success: true,
          data: responseData as T,
        };
      }
    }

    throw this.createErrorFromResponse(response, responseData);
  }

  /**
   * Handle request errors and create appropriate error instances
   */
  protected handleError(error: any): Error {
    if (error.name?.includes("Error")) {
      return error;
    }

    return new NetworkError("Unexpected error occurred", {
      originalError: error,
    });
  }

  /**
   * Create specific error based on HTTP response
   */
  private createErrorFromResponse(response: Response, data: any): Error {
    const message =
      data?.message || data?.error || `HTTP ${response.status} error`;
    const details = {
      statusCode: response.status,
      statusText: response.statusText,
      response: data,
    };

    switch (response.status) {
      case HTTP_STATUS.BAD_REQUEST:
        return new ValidationError(message, details);

      case HTTP_STATUS.UNAUTHORIZED:
        return new AuthenticationError(message, details);

      case HTTP_STATUS.FORBIDDEN:
        return new AuthorizationError(message, details);

      case HTTP_STATUS.NOT_FOUND:
        return new NotFoundError("Resource", undefined);

      case HTTP_STATUS.TOO_MANY_REQUESTS:
        const retryAfter = response.headers.get("Retry-After");
        return new RateLimitError(
          message,
          retryAfter ? parseInt(retryAfter) : undefined,
        );

      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      case HTTP_STATUS.BAD_GATEWAY:
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
      case HTTP_STATUS.GATEWAY_TIMEOUT:
        return new ServerError(message, response.status, details);

      default:
        return new ServerError(message, response.status, details);
    }
  }

  protected override async request<T>(
    config: RequestConfig,
  ): Promise<ApiResponse<T>> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.config.retries; attempt++) {
      try {
        const response = await super.request<T>(config);
        return response;
      } catch (error: any) {
        lastError = error;

        if (attempt === this.config.retries || !isRetryableError(error)) {
          if (attempt === this.config.retries) {
            this.logger.error("All retry attempts exhausted", {
              method: config.method,
              url: config.url,
              totalAttempts: this.config.retries,
              finalErrorCode:
                error instanceof BriqError ? error.code : "UNKNOWN",
            });
          } else {
            this.logger.info("Error is not retryable, failing immediately", {
              method: config.method,
              url: config.url,
              errorCode: error instanceof BriqError ? error.code : "UNKNOWN",
              details: error.details || "",
            });
          }
          break;
        }

        const delayMs = calculateBackoffDelay(
          attempt,
          RETRY_CONFIG.INITIAL_DELAY,
        );

        await delay(delayMs);
      }
    }

    throw lastError!;
  }

  /**
   * Get the current logger instance
   */
  public getLogger(): Logger {
    return this.logger;
  }

  /**
   * Set a custom logger instance
   */
  public setLogger(logger: Logger): void {
    this.logger = logger;
    this.logger.info("Custom logger set for HTTP client");
  }
}

export type { Logger };
