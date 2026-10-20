import { APIResponse } from '@playwright/test';
import { BaseService } from './BaseService';

export class BookingService extends BaseService {
    
    async checkApiHealth() {
        
        return await this.request.get(`${this.baseUrl}/ping`);
    }

    async createBooking(payload: object): Promise<APIResponse> {
       const response = await this.request.post(`${this.baseUrl}/booking`, {
            data: payload,
            headers: this.getCommonHeaders() 
        });

        return response;
}

async getBookingById(id: number) {
    return await this.request.get(`${this.baseUrl}/booking/${id}`, {
        headers: this.getCommonHeaders()
    });
}

async patchBooking(id: number, partialPayload: object, authorization?: string): Promise<APIResponse> {
    const headers: Record<string, string> = this.getCommonHeaders();
    // Without an authorization value no Authorization header is sent
    if (authorization) {
        headers['Authorization'] = authorization;
    }
    return await this.request.patch(`${this.baseUrl}/booking/${id}`, { data: partialPayload, headers });
}

async login(username: string, password: string): Promise<APIResponse> {
    return await this.request.post(`${this.baseUrl}/auth`, {
        data: { username, password },
        headers: this.getCommonHeaders()
    });
}

async createToken(): Promise<string> {
    const response = await this.login(process.env.API_ADMIN_USER!, process.env.API_ADMIN_PASSWORD!);
    if (!response.ok()) {
        throw new Error(`Failed to create token: ${response.statusText()}`);
    }
    const body = await response.json();
    return body.token; 
}

async updateBooking(id: number, fullPayload: object, token?: string): Promise<APIResponse> {
    const headers: Record<string, string> = this.getCommonHeaders();
    // Without a token no Cookie header is sent, so tests can check the API rejects the request
    if (token) {
        headers['Cookie'] = `token=${token}`;
    }
    return await this.request.put(`${this.baseUrl}/booking/${id}`, { data: fullPayload, headers });
}

async deleteBooking(id: number, token?: string): Promise<APIResponse> {
    const headers: Record<string, string> = this.getCommonHeaders();
    // Without a token no Cookie header is sent, so tests can check the API rejects the request
    if (token) {
        headers['Cookie'] = `token=${token}`;
    }
    return await this.request.delete(`${this.baseUrl}/booking/${id}`, { headers });
}
}