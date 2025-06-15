import { BaseService } from "./BaseService";
import type {
  Message,
  MessageHistoryParams,
  MessageLogsParams,
  SendCampaignMessageRequest,
  SendInstantMessageRequest,
} from "../types/message";
import type { ApiResponse, PaginatedResponse } from "../types/common";
import { ENDPOINTS } from "../utils/constants";
import {
  validateMessage,
  validatePaginationParams,
  validatePhoneNumbers,
  validateUUID,
} from "../utils/validators";
import { ValidationError } from "../utils/errors";
import { formatPhoneNumbers } from "../utils/helpers";

/**
 * Service for managing messages
 */
export class MessageService extends BaseService {
  /**
   * Send instant message to one or multiple recipients
   */
  async sendInstant(
    request: SendInstantMessageRequest,
  ): Promise<ApiResponse<Message | Message[]>> {
    this.validateRequired(request, ["recipients", "content"]);

    const recipients = Array.isArray(request.recipients)
      ? request.recipients
      : [request.recipients];

    validatePhoneNumbers(recipients);
    validateMessage(request.content);

    const formattedRecipients = formatPhoneNumbers(recipients);

    const sanitizedRequest: SendInstantMessageRequest = {
      content: request.content,
      recipients: formattedRecipients,
      sender_id: request.sender_id || "",
    };

    if (request.campaign_id) {
      (sanitizedRequest as any).campaign_id = request.campaign_id;
    }

    try {
      return await this.client.post<Message | Message[]>(
        ENDPOINTS.MESSAGES.SEND_INSTANT,
        sanitizedRequest,
      );
    } catch (error: any) {
      throw new Error(
        `Failed to send instant message: ${this.formatError(error)}`,
      );
    }
  }

  /**
   * Send campaign message
   */
  async sendCampaign(
    request: SendCampaignMessageRequest,
  ): Promise<ApiResponse<Message[]>> {
    this.validateRequired(request, ["campaign_id"]);
    validateUUID(request.campaign_id, "Campaign ID");

    const sanitizedRequest = this.sanitizeInput(request);

    try {
      return await this.client.post<Message[]>(
        ENDPOINTS.MESSAGES.SEND_CAMPAIGN,
        sanitizedRequest,
      );
    } catch (error: any) {
      throw new Error(
        `Failed to send campaign message: ${this.formatError(error)}`,
      );
    }
  }

  /**
   * Get message logs with filtering
   */
  async getLogs(
    params: MessageLogsParams = {},
  ): Promise<PaginatedResponse<Message>> {
    if (Object.keys(params).length > 0) {
      validatePaginationParams(params);
    }

    if (params.campaign_id) {
      validateUUID(params.campaign_id, "Campaign ID");
    }

    if (
      params.status &&
      !["pending", "sent", "delivered", "failed", "cancelled"].includes(
        params.status,
      )
    ) {
      throw new ValidationError(
        "Invalid status. Must be one of: pending, sent, delivered, failed, cancelled",
      );
    }

    if (params.phoneNumber !== undefined) {
      const formatted = formatPhoneNumbers([params.phoneNumber])[0];
      if (formatted !== undefined) {
        params.phoneNumber = formatted;
      }
    }

    try {
      return (await this.client.get<Message[]>(ENDPOINTS.MESSAGES.LOGS, {
        params,
      })) as PaginatedResponse<Message>;
    } catch (error: any) {
      throw new Error(`Failed to get message logs: ${this.formatError(error)}`);
    }
  }

  /**
   * Get message history for a specific phone number
   */
  async getHistory(
    params: MessageHistoryParams = {},
  ): Promise<PaginatedResponse<Message>> {
    if (Object.keys(params).length > 0) {
      validatePaginationParams(params);
    }

    if (params.workspace_id) {
      validateUUID(params.workspace_id, "Workspace ID");
    }

    if (params.phoneNumber) {
      const formatted = formatPhoneNumbers([params.phoneNumber])[0];
      if (formatted !== undefined) {
        params.phoneNumber = formatted;
      } else {
        delete params.phoneNumber;
      }
    }

    try {
      return (await this.client.get<Message[]>(ENDPOINTS.MESSAGES.HISTORY, {
        params,
      })) as PaginatedResponse<Message>;
    } catch (error: any) {
      throw new Error(
        `Failed to get message history: ${this.formatError(error)}`,
      );
    }
  }
}
