import { HttpClient } from './HttpClient';
import { WorkspaceService } from '@services/WorkspaceService';
import { MessageService } from '@services/MessageService';
import { CampaignService } from '@services/CampaignService';
import type { BriqConfig } from '@/types/common';
import { validateApiKey } from '../utils/validators';
import { ConfigurationError } from '../utils/errors';
import { API_CONFIG } from '../utils/constants';

/**
 * Main Briq SDK Client
 */
export class Briq {
    private readonly httpClient: HttpClient;
    public readonly workspaces: WorkspaceService;
    public readonly messages: MessageService;
    public readonly campaigns: CampaignService;

    constructor(config: BriqConfig) {
        this.validateConfig(config);

        this.httpClient = new HttpClient({
            baseUrl: API_CONFIG.BASE_URL,
            timeout: API_CONFIG.DEFAULT_TIMEOUT,
            retries: API_CONFIG.DEFAULT_RETRIES,
            version: API_CONFIG.VERSION,
            ...config
        });

        this.workspaces = new WorkspaceService(this.httpClient);
        this.messages = new MessageService(this.httpClient);
        this.campaigns = new CampaignService(this.httpClient);
    }

    /**
     * Validate SDK configuration
     */
    private validateConfig(config: BriqConfig): void {
        if (!config) {
            throw new ConfigurationError('Configuration object is required');
        }

        try {
            validateApiKey(config.apiKey);
        } catch (error: any) {
            throw new ConfigurationError(`Invalid API key: ${error.message}`);
        }

        if (config.baseUrl && typeof config.baseUrl !== 'string') {
            throw new ConfigurationError('Base URL must be a string');
        }

        if (config.timeout && (!Number.isInteger(config.timeout) || config.timeout <= 0)) {
            throw new ConfigurationError('Timeout must be a positive integer');
        }

        if (config.retries && (!Number.isInteger(config.retries) || config.retries < 0)) {
            throw new ConfigurationError('Retries must be a non-negative integer');
        }
    }

    /**
     * Test connection to the API
     */
    async testConnection(): Promise<boolean> {
        try {
            const res = await this.workspaces.list();
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get SDK configuration
     */
    getConfig(): Omit<Required<BriqConfig>, 'apiKey'> {
        return {
            baseUrl: this.httpClient['config'].baseUrl,
            timeout: this.httpClient['config'].timeout,
            retries: this.httpClient['config'].retries,
            version: this.httpClient['config'].version
        };
    }
}