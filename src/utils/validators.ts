import { VALIDATION_PATTERNS } from "./constants";
import { ValidationError } from "./errors";

/**
 * Validate API key format
 */
export function validateApiKey(apiKey: string): void {
  if (!apiKey || typeof apiKey !== "string") {
    throw new ValidationError("API key is required and must be a string");
  }

  if (!VALIDATION_PATTERNS.API_KEY.test(apiKey)) {
    throw new ValidationError("Invalid API key format");
  }
}

/**
 * Validate phone number format
 */
export function validatePhoneNumber(phoneNumber: string): void {
  if (!phoneNumber || typeof phoneNumber !== "string") {
    throw new ValidationError("Phone number is required and must be a string");
  }

  const cleanNumber = phoneNumber.replace(/[\s-]/g, "");

  if (!VALIDATION_PATTERNS.PHONE_NUMBER.test(cleanNumber)) {
    throw new ValidationError(`Invalid phone number format: ${phoneNumber}`);
  }
}

/**
 * Validate multiple phone numbers
 */
export function validatePhoneNumbers(phoneNumbers: string[]): void {
  if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
    throw new ValidationError("Phone numbers must be a non-empty array");
  }

  phoneNumbers.forEach((phoneNumber, index) => {
    try {
      validatePhoneNumber(phoneNumber);
    } catch {
      throw new ValidationError(
        `Invalid phone number at index ${index}: ${phoneNumber}`,
      );
    }
  });
}

/**
 * Validate message content
 */
export function validateMessage(message: string, maxLength = 1600): void {
  if (!message || typeof message !== "string") {
    throw new ValidationError("Message is required and must be a string");
  }

  if (message.trim().length === 0) {
    throw new ValidationError("Message cannot be empty");
  }

  if (message.length > maxLength) {
    throw new ValidationError(
      `Message too long. Maximum ${maxLength} characters allowed`,
    );
  }
}

/**
 * Validate workspace name
 */
export function validateWorkspaceName(name: string): void {
  if (!name || typeof name !== "string") {
    throw new ValidationError(
      "Workspace name is required and must be a string",
    );
  }

  if (name.trim().length === 0) {
    throw new ValidationError("Workspace name cannot be empty");
  }

  if (name.length > 100) {
    throw new ValidationError(
      "Workspace name too long. Maximum 100 characters allowed",
    );
  }
}

/**
 * Validate campaign name
 */
export function validateCampaignName(name: string): void {
  if (!name || typeof name !== "string") {
    throw new ValidationError("Campaign name is required and must be a string");
  }

  if (name.trim().length === 0) {
    throw new ValidationError("Campaign name cannot be empty");
  }

  if (name.length > 150) {
    throw new ValidationError(
      "Campaign name too long. Maximum 150 characters allowed",
    );
  }
}

/**
 * Validate UUID format
 */
export function validateUUID(id: string, fieldName = "ID"): void {
  if (!id || typeof id !== "string") {
    throw new ValidationError(`${fieldName} is required and must be a string`);
  }

  if (!VALIDATION_PATTERNS.UUID.test(id)) {
    throw new ValidationError(`Invalid ${fieldName} format`);
  }
}

/**
 * Validate pagination parameters
 */
export function validatePaginationParams(params: {
  page?: number;
  limit?: number;
  offset?: number;
}): void {
  if (params.page !== undefined) {
    if (!Number.isInteger(params.page) || params.page < 1) {
      throw new ValidationError("Page must be a positive integer");
    }
  }

  if (params.limit !== undefined) {
    if (
      !Number.isInteger(params.limit) ||
      params.limit < 1 ||
      params.limit > 100
    ) {
      throw new ValidationError("Limit must be an integer between 1 and 100");
    }
  }

  if (params.offset !== undefined) {
    if (!Number.isInteger(params.offset) || params.offset < 0) {
      throw new ValidationError("Offset must be a non-negative integer");
    }
  }
}

/**
 * Validate ISO date string
 */
export function validateISODate(dateString: string, fieldName = "Date"): void {
  if (!dateString || typeof dateString !== "string") {
    throw new ValidationError(`${fieldName} is required and must be a string`);
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new ValidationError(
      `Invalid ${fieldName} format. Must be a valid ISO date string`,
    );
  }

  if (date <= new Date()) {
    throw new ValidationError(`${fieldName} must be in the future`);
  }
}
