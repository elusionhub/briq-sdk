import type { BaseEntity, PaginationParams } from "./common";

/**
 * Campaign creation request
 */
export interface CreateCampaignRequest {
    name: string;
    description?: string;
    workspace_id: string;
    launch_date: Date | string;
}

/**
 * Campaign update request
 */
export interface UpdateCampaignRequest {
    name: string;
    description?: string;
    workspace_id: string;
    launch_date: string;
}

/**
 * Campaign entity
 */
export interface Campaign extends BaseEntity {
    campaign_id: string;
    workspace_id: string;
    name: string;
    description?: string;
    launch_date?: string;
    created_by?: string;
}

/**
 * Campaign list parameters
 */
export interface CampaignListParams extends PaginationParams {
    workspace_id?: string;
    search?: string;
    from?: string; // Date filter
    to?: string; // Date filter
}