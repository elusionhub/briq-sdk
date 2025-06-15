/**
 * Karibu Briq SMS SDK for TypeScript/JavaScript
 *
 * A comprehensive SDK for managing workspaces, campaigns, and SMS messages
 * through the Karibu Briq SMS API.
 *
 * @example
 * ```typescript
 * import { Briq } from 'briq-sdk';
 *
 * const client = new Briq({
 *   apiKey: 'your-api-key-here'
 * });
 *
 * // Create a workspace
 * const workspace = await client.workspaces.create({
 *   name: 'My Workspace',
 *   description: 'A workspace for my SMS campaigns'
 * });
 *
 * // Send an instant message
 * const message = await client.messages.sendInstant({
 *   to: '+1234567890',
 *   message: 'Hello from Briq!'
 * });
 * ```
 */

export { Briq } from "./client/BriqClient";
import { Briq } from "./client/BriqClient";

import type { CampaignService } from "./services/CampaignService";
import type { MessageService } from "./services/MessageService";
import type { WorkspaceService } from "./services/WorkspaceService";
import type {
  ApiResponse,
  BaseEntity,
  BriqConfig,
  PaginatedResponse,
} from "./types/common";

export { WorkspaceService } from "./services/WorkspaceService";
export { MessageService } from "./services/MessageService";
export { CampaignService } from "./services/CampaignService";

export { BaseClient } from "./client/BaseClient";
export { BaseService } from "./services/BaseService";
export { HttpClient } from "./client/HttpClient";

export type {
  BriqConfig,
  ApiResponse,
  ApiError,
  HttpMethod,
  RequestConfig,
  PaginationParams,
  PaginatedResponse,
  BaseEntity,
  OperationStatus,
  RetryConfig,
} from "./types/common";

export type {
  Workspace,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  WorkspaceListParams,
} from "./types/workspace";

export type {
  Message,
  MessageStatus,
  SendInstantMessageRequest,
  SendCampaignMessageRequest,
  MessageLogsParams,
  MessageHistoryParams,
} from "./types/message";

export type {
  Campaign,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  CampaignListParams,
} from "./types/campaign";

export {
  BriqError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  NetworkError,
  ServerError,
  ConfigurationError,
  TimeoutError,
} from "./utils/errors";

export {
  validateApiKey,
  validatePhoneNumber,
  validatePhoneNumbers,
  validateMessage,
  validateWorkspaceName,
  validateCampaignName,
  validateUUID,
  validatePaginationParams,
  validateISODate,
} from "./utils/validators";

export {
  formatPhoneNumber,
  formatPhoneNumbers,
  calculateSMSSegments,
  normalizePaginationParams,
  delay,
  calculateBackoffDelay,
  isRetryableError,
  deepClone,
} from "./utils/helpers";

export {
  API_CONFIG,
  ENDPOINTS,
  HTTP_STATUS,
  VALIDATION_PATTERNS,
  PAGINATION_DEFAULTS,
  RETRY_CONFIG,
} from "./utils/constants";

/**
 * Default export for CommonJS compatibility
 */
export default Briq;

/**
 * Factory function to create a Briq client instance
 */
export { briq } from "./factory";

/**
 * Create a new Karibu client instance
 *
 * @param config - Configuration options for the SDK
 * @returns A new KaribuClient instance
 *
 * @example
 * ```typescript
 * import { createClient } from 'karibu-briq-sdk';
 *
 * const client = createClient({
 *   apiKey: 'your-api-key-here',
 *   timeout: 30000
 * });
 * ```
 */
export function createClient(config: BriqConfig): Briq {
  return new Briq(config);
}

/**
 * SDK version information
 */
export const VERSION = "0.1.0";

export type {
  BriqConfig as Config,
  ApiResponse as Response,
  PaginatedResponse as PaginatedResult,
};

/**
 * Utility type for extracting response data
 */
export type ResponseData<T> = T extends ApiResponse<infer U> ? U : never;

/**
 * Utility type for creating request types
 */
export type RequestOf<T> = Omit<T, keyof BaseEntity>;

export interface SDKMethods {
  workspaces: WorkspaceService;
  messages: MessageService;
  campaigns: CampaignService;
  testConnection(): Promise<boolean>;
  getConfig(): Omit<Required<BriqConfig>, "apiKey">;
}

/**
 * SDK metadata
 */
export const SDK_INFO = {
  name: "briq-sdk",
  packageName: "@elusion-sdk/briq",
  version: VERSION,
  description: "TypeScript/JavaScript SDK for Karibu Briq SMS API",
  author: "Elusion Lab <elusion.lab@gmail.com>",
  maintainers: [
    "Elusion Lab <elusion.lab@gmail.com>",
    "Eric Kweyunga <maverickweyunga@gmail.com>",
    "Briq Team <sms@briq.tz>",
  ],
  license: "MIT",
  repository: "https://github.com/elusionhub/briq-sdk.git",
  documentation: "https://briq.tz/documentation/home",
  apiVersion: "v1",
} as const;
