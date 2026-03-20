import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
    
    readonly heading: Locator;
    readonly hotelImage: Locator;
    readonly checkAvailabilityButton: Locator;
    readonly locationLink: Locator;
    readonly roomCards: Locator;
    readonly bookNowLink: Locator;
    
    constructor(page: any) {
        super(page); 
        this.heading = page.getByRole('link', { name: 'Shady Meadows B&B' });
        this.checkAvailabilityButton = page.getByRole('button', { name: 'Check Availability' });
        this.hotelImage = page.getByRole('img', { name: 'Single Room' }).first();
        this.locationLink = page.getByRole('link', { name: 'Location' });
        this.roomCards = page.locator('.col-md-6').filter({ hasText: 'Book now' });
        this.bookNowLink = page.getByRole('link', { name: 'Book now' });
        
    }

    async verifyHomePageIsLoaded() {
        // We use 'expect' to verify visibility
        await expect(this.heading).toBeVisible();
        await expect(this.checkAvailabilityButton).toBeVisible();
        await expect(this.hotelImage).toBeVisible();
        await expect(this.locationLink).toBeVisible();
        
        }

        async clickRandomRoom() {
        const count = await this.roomCards.count();
        const randomIndex = Math.floor(Math.random() * count);
        await this.roomCards.nth(randomIndex).locator(this.bookNowLink).click();
        console.log(`Clicked room card #${randomIndex + 1}`);
    }
}

