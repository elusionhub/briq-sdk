import { getDefaultsFromEnv } from "../config/defaults";

/**
 * API version and base configuration
 */
export const API_CONFIG = {
  API_KEY: getDefaultsFromEnv().apiKey,
  BASE_URL: getDefaultsFromEnv().baseUrl,
  VERSION: getDefaultsFromEnv().version,
  DEFAULT_TIMEOUT: getDefaultsFromEnv().timeout,
  DEFAULT_RETRIES: 3,
  USER_AGENT: "Briq-SDK-TS",
} as const;

/**
 * API endpoints
 */
export const ENDPOINTS = {
  MESSAGES: {
    SEND_INSTANT: "message/send-instant",
    SEND_CAMPAIGN: "message/send-campaign",
    LOGS: "message/logs",
    HISTORY: "message/history",
  },
  WORKSPACES: {
    CREATE: "workspace/create/",
    GET_ALL: "workspace/all/",
    GET_BY_ID: (id: string) => `workspace/${id}`,
    UPDATE: (id: string) => `workspace/update/${id}`,
  },
  CAMPAIGNS: {
    CREATE: "campaign/create/",
    GET_ALL: "campaign/all/",
    GET_BY_ID: (id: string) => `campaign/${id}/`,
    UPDATE: (id: string) => `campaign/update/${id}`,
  },
} as const;

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

/**
 * Validation patterns
 */
export const VALIDATION_PATTERNS = {
  PHONE_NUMBER: /^\+?[1-9]\d{1,14}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  API_KEY: /^[a-zA-Z0-9_-]{16,}$/,
} as const;

/**
 * Default pagination settings
 */
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

/**
 * Retry configuration
 */
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_DELAY: 1000,
  MAX_DELAY: 10000,
  BACKOFF_FACTOR: 2,
} as const;
