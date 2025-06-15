import type {
    Workspace,
    CreateWorkspaceRequest,
    UpdateWorkspaceRequest,
    WorkspaceListParams
} from '../types/workspace';
import type { ApiResponse, PaginatedResponse } from '../types/common';
import { ENDPOINTS } from '../utils/constants';
import {
    validateWorkspaceName,
    validateUUID,
    validatePaginationParams
} from '../utils/validators';
import { NotFoundError, ValidationError } from '../utils/errors';
import { BaseService } from './BaseService';

/**
 * Service for managing workspaces
 */
export class WorkspaceService extends BaseService {

    /**
     * Create a new workspace
     */
    async create(request: CreateWorkspaceRequest): Promise<ApiResponse<Workspace>> {
        // Validate input
        this.validateRequired(request, ['name']);
        validateWorkspaceName(request.name);

        if (request.description && request.description.length > 500) {
            throw new ValidationError('Description too long. Maximum 500 characters allowed');
        }

        // Sanitize input
        const sanitizedRequest = this.sanitizeInput(request);

        try {
            return await this.client.post<Workspace>(
                ENDPOINTS.WORKSPACES.CREATE,
                sanitizedRequest
            );
        } catch (error: any) {
            throw new Error(`Failed to create workspace: ${this.formatError(error)}`);
        }
    }

    /**
     * Get all workspaces with optional filtering and pagination
     */
    async list(params: WorkspaceListParams = {}): Promise<PaginatedResponse<Workspace>> {
        if (Object.keys(params).length > 0) {
            validatePaginationParams(params);
        }

        if (params.search) {
            params.search = params.search.trim();
            if (params.search.length > 100) {
                throw new ValidationError('Search term too long. Maximum 100 characters allowed');
            }
        }

        try {
            const response = await this.client.get<Workspace[]>(
                ENDPOINTS.WORKSPACES.GET_ALL,
                { params }
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
                        hasPrev: (params.page || 1) > 1
                    }
                };
            }

            return response as PaginatedResponse<Workspace>;
        } catch (error: any) {
            throw new Error(`Failed to list workspaces: ${this.formatError(error)}`);
        }
    }

    /**
     * Get a specific workspace by ID
     */
    async getById(workspaceId: string): Promise<ApiResponse<Workspace>> {
        validateUUID(workspaceId, 'Workspace ID');

        try {
            return await this.client.get<Workspace>(
                ENDPOINTS.WORKSPACES.GET_BY_ID(workspaceId)
            );
        } catch (error: any) {
            if (error.statusCode === 404) {
                throw new NotFoundError('Workspace', workspaceId);
            }
            throw new Error(`Failed to get workspace: ${this.formatError(error)}`);
        }
    }

    /**
     * Update an existing workspace
     */
    async update(
        workspaceId: string,
        request: UpdateWorkspaceRequest
    ): Promise<ApiResponse<Workspace>> {
        validateUUID(workspaceId, 'Workspace ID');

        if (Object.keys(request).length === 0) {
            throw new ValidationError('Update request cannot be empty');
        }

        if (request.name !== undefined) {
            validateWorkspaceName(request.name);
        }

        if (request.description && request.description.length > 500) {
            throw new ValidationError('Description too long. Maximum 500 characters allowed');
        }

        const sanitizedRequest = this.sanitizeInput(request);

        try {
            return await this.client.patch<Workspace>(
                ENDPOINTS.WORKSPACES.UPDATE(workspaceId),
                sanitizedRequest
            );
        } catch (error: any) {
            if (error.statusCode === 404) {
                throw new NotFoundError('Workspace', workspaceId);
            }
            throw new Error(`Failed to update workspace: ${this.formatError(error)}`);
        }
    }

    /**
     * Check if workspace exists
     */
    async exists(workspaceId: string): Promise<boolean> {
        try {
            await this.getById(workspaceId);
            return true;
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                return false;
            }
            throw error;
        }
    }
}