import { PAGINATION_DEFAULTS } from "./constants";

/**
 * Format phone number to standard format
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters except +
  let cleaned = phoneNumber.replace(/[^\d+]/g, "");

  // Add + if it doesn't start with + or country code
  if (!cleaned.startsWith("+")) {
    cleaned = `+${cleaned}`;
  }

  return cleaned;
}

/**
 * Format multiple phone numbers
 */
export function formatPhoneNumbers(phoneNumbers: string[]): string[] {
  return phoneNumbers.map(formatPhoneNumber);
}

/**
 * Calculate SMS segments (160 chars per segment for basic SMS)
 */
export function calculateSMSSegments(message: string): number {
  const basicLength = 160;
  const unicodeLength = 70;

  const hasUnicode = /[^\x00-\x7F]/.test(message);
  const segmentLength = hasUnicode ? unicodeLength : basicLength;

  return Math.ceil(message.length / segmentLength);
}

/**
 * Sanitize and normalize pagination parameters
 */
export function normalizePaginationParams(params: {
  page?: number;
  limit?: number;
  offset?: number;
}): Required<{ page: number; limit: number; offset: number }> {
  const page = Math.max(1, params.page || PAGINATION_DEFAULTS.PAGE);
  const limit = Math.min(
    PAGINATION_DEFAULTS.MAX_LIMIT,
    Math.max(1, params.limit || PAGINATION_DEFAULTS.LIMIT),
  );
  const offset = params.offset || (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Create a delay for retry mechanisms
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate exponential backoff delay
 */
export function calculateBackoffDelay(
  attempt: number,
  baseDelay = 1000,
  maxDelay = 10000,
  factor = 2,
): number {
  const delay = baseDelay * Math.pow(factor, attempt - 1);
  return Math.min(delay, maxDelay);
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: any): boolean {
  if (error.code === "NETWORK_ERROR" || error.code === "TIMEOUT_ERROR") {
    return true;
  }

  if (error.statusCode) {
    return error.statusCode >= 500 || error.statusCode === 429;
  }

  return false;
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}
