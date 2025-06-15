import type { BaseEntity, PaginationParams } from './common';

/**
 * Workspace creation request
 */
export interface CreateWorkspaceRequest {
    name: string;
    description?: string;
}

/**
 * Workspace update request
 */
export interface UpdateWorkspaceRequest {
    name?: string;
    description?: string;
}

/**
 * Workspace entity
 */
export interface Workspace extends BaseEntity {
    workspace_id: string;
    user_id: string;
    name: string;
    description?: string;
}

/**
 * Parameters for listing workspaces
 */
export interface WorkspaceListParams extends PaginationParams {
    search?: string;
}