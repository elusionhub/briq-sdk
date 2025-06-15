import type {
  Campaign,
  CampaignListParams,
  CreateCampaignRequest,
  UpdateCampaignRequest,
} from "../types/campaign";
import type { ApiResponse, PaginatedResponse } from "../types/common";
import { ENDPOINTS } from "../utils/constants";
import {
  validateCampaignName,
  validateISODate,
  validatePaginationParams,
  validateUUID,
} from "../utils/validators";
import { NotFoundError, ValidationError } from "../utils/errors";
import { BaseService } from "./BaseService";

/**
 * Service for managing campaigns
 */
export class CampaignService extends BaseService {
  /**
   * Create a new campaign
   */
  async create(request: CreateCampaignRequest): Promise<ApiResponse<Campaign>> {
    this.validateRequired(request, ["name", "workspace_id", "launch_date"]);

    validateCampaignName(request.name);
    validateUUID(request.workspace_id, "Workspace ID");

    if (request.description && request.description.length > 500) {
      throw new ValidationError(
        "Description too long. Maximum 500 characters allowed",
      );
    }

    const sanitizedRequest = {
      ...this.sanitizeInput(request),
      settings: {
        sendRate: 60,
        retryFailures: true,
        maxRetries: 3,
        stopOnFailure: false,
        trackClicks: false,
        trackReplies: false,
      },
    };

    try {
      return await this.client.post<Campaign>(
        ENDPOINTS.CAMPAIGNS.CREATE,
        sanitizedRequest,
      );
    } catch (error: any) {
      throw new Error(`Failed to create campaign: ${this.formatError(error)}`);
    }
  }

  /**
   * Get all campaigns with optional filtering and pagination
   */
  async list(
    params: CampaignListParams = {},
  ): Promise<PaginatedResponse<Campaign>> {
    if (Object.keys(params).length > 0) {
      validatePaginationParams(params);
    }

    if (params.workspace_id) {
      validateUUID(params.workspace_id, "Workspace ID");
    }

    if (params.search) {
      params.search = params.search.trim();
      if (params.search.length > 100) {
        throw new ValidationError(
          "Search term too long. Maximum 100 characters allowed",
        );
      }
    }

    try {
      const response = await this.client.get<Campaign[]>(
        ENDPOINTS.CAMPAIGNS.GET_ALL,
        { params },
      );

      if (response.data && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data,
          pagination: {
            page: params.page || 1,
            limit: params.limit || 20,
            total: response.data.length,
            totalPages: Math.ceil(response.data.length / (params.limit || 20)),
            hasNext: false,
            hasPrev: (params.page || 1) > 1,
          },
        };
      }

      return response as PaginatedResponse<Campaign>;
    } catch (error: any) {
      throw new Error(`Failed to list campaigns: ${this.formatError(error)}`);
    }
  }

  /**
   * Get a specific campaign by ID
   */
  async getById(campaignId: string): Promise<ApiResponse<Campaign>> {
    validateUUID(campaignId, "Campaign ID");

    try {
      return await this.client.get<Campaign>(
        ENDPOINTS.CAMPAIGNS.GET_BY_ID(campaignId),
      );
    } catch (error: any) {
      if (error.statusCode === 404) {
        throw new NotFoundError("Campaign", campaignId);
      }
      throw new Error(`Failed to get campaign: ${this.formatError(error)}`);
    }
  }

  /**
   * Update an existing campaign
   */
  async update(
    campaignId: string,
    request: UpdateCampaignRequest,
  ): Promise<ApiResponse<Campaign>> {
    validateUUID(campaignId, "Campaign ID");

    if (Object.keys(request).length === 0) {
      throw new ValidationError("Update request cannot be empty");
    }

    if (request.name !== undefined) {
      validateCampaignName(request.name);
    }

    if (request.launch_date !== undefined) {
      validateISODate(request.launch_date, "Schedule date");
    }

    if (request.description && request.description.length > 500) {
      throw new ValidationError(
        "Description too long. Maximum 500 characters allowed",
      );
    }

    const sanitizedRequest = this.sanitizeInput(request);

    try {
      return await this.client.patch<Campaign>(
        ENDPOINTS.CAMPAIGNS.UPDATE(campaignId),
        sanitizedRequest,
      );
    } catch (error: any) {
      if (error.statusCode === 404) {
        throw new NotFoundError("Campaign", campaignId);
      }
      throw new Error(`Failed to update campaign: ${this.formatError(error)}`);
    }
  }

  /**
   * Delete a campaign
   */
  async delete(campaignId: string): Promise<ApiResponse<{ deleted: boolean }>> {
    validateUUID(campaignId, "Campaign ID");

    try {
      return await this.client.delete<{ deleted: boolean }>(
        `campaign/${campaignId}`,
      );
    } catch (error: any) {
      if (error.statusCode === 404) {
        throw new NotFoundError("Campaign", campaignId);
      }
      throw new Error(`Failed to delete campaign: ${this.formatError(error)}`);
    }
  }

  /**
   * Check if campaign exists
   */
  async exists(campaignId: string): Promise<boolean> {
    try {
      await this.getById(campaignId);
      return true;
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        return false;
      }
      throw error;
    }
  }
}
