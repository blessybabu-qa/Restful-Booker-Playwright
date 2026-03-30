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

async patchBooking(id: number, partialPayload: object): Promise<APIResponse> {
    return await this.request.patch(`${this.baseUrl}/booking/${id}`, {
        data: partialPayload,
              headers: {
                       ...this.getCommonHeaders(), 
                       'Authorization': process.env.API_ADMIN_TOKEN || '',
           }
 });
}

async createToken(): Promise<string> {
    const response = await this.request.post(`${this.baseUrl}/auth`, {
        data: {
            username: "admin",
            password: "password123"
        },
        headers: this.getCommonHeaders()
    });
    const body = await response.json();
    return body.token; 
}

async updateBooking(id: number, fullPayload: object, token: string): Promise<APIResponse> {
    return await this.request.put(`${this.baseUrl}/booking/${id}`, {
        data: fullPayload,
        headers: {
            ...this.getCommonHeaders(),
            'Cookie': `token=${token}`
        }
    });
}

async deleteBooking(id: number, token: string): Promise<APIResponse> {
    return await this.request.delete(`${this.baseUrl}/booking/${id}`, {
        headers: {
            ...this.getCommonHeaders(),
            'Cookie': `token=${token}`
        }
    });
}
}