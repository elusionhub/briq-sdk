import type { BaseEntity, PaginationParams } from "./common";

/**
 * Message status types
 */
export type MessageStatus =
  | "pending"
  | "sent"
  | "delivered"
  | "failed"
  | "cancelled";

/**
 * Instant message request
 */
export interface SendInstantMessageRequest {
  content: string;
  recipients: string[];
  sender_id: string;
  campaign_id?: string;
}

/**
 * Campaign message request
 */
export interface SendCampaignMessageRequest {
  campaign_id: string;
  group_id: string;
  content: string;
  sender_id: string;
}

/**
 * Message entity
 */
export interface Message extends BaseEntity {
  message_id: string;
  recipients: string[];
  campaign_id?: string;
  content?: string;
  timestamp?: string;
  sender_id: string;
  status: MessageStatus;
}

/**
 * Message logs parameters
 */
export interface MessageLogsParams extends PaginationParams {
  workspace_id?: string;
  campaign_id?: string;
  status?: MessageStatus;
  from?: string; // Date filter
  to?: string; // Date filter
  phoneNumber?: string;
}

/**
 * Message history parameters
 */
export interface MessageHistoryParams extends PaginationParams {
  workspace_id?: string;
  phoneNumber?: string;
  from?: string; // Date filter
  to?: string; // Date filter
}

/**
 * Message history response
 */
export interface MessageHistoryResponse {
  success: boolean;
  history: Message[];
}
