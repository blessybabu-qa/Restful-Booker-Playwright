import { APIRequestContext } from '@playwright/test';

export class BaseService {
    readonly request: APIRequestContext;
    readonly baseUrl: string;

    constructor(request: APIRequestContext) {
        this.request = request;
        // Clean the URL once here
        this.baseUrl = (process.env.API_URL || '').replace(/\/$/, '');
    }

    async checkHealth() {
        return await this.request.get(`${this.baseUrl}/ping`);
    }

     getCommonHeaders() {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    }
}