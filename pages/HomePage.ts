import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
    readonly heading: any;
    readonly hotelImage: any;
    readonly checkAvailabilityButton: any;
    readonly locationLink:any;
    
    constructor(page: any) {
        super(page); 
        this.heading = page.getByRole('link', { name: 'Shady Meadows B&B' });
        this.checkAvailabilityButton = page.getByRole('button', { name: 'Check Availability' });
        this.hotelImage = page.getByRole('img', { name: 'Single Room' }).first();
        this.locationLink = page.getByRole('link', { name: 'Location' });
        
    }

    async verifyHomePageIsLoaded() {
        // We use 'expect' to verify visibility
        await expect(this.heading).toBeVisible();
        await expect(this.checkAvailabilityButton).toBeVisible();
        await expect(this.hotelImage).toBeVisible();
        await expect(this.locationLink).toBeVisible();
        
        }
}