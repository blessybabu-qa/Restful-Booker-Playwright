import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from "./BasePage";

export class RoomPage extends BasePage {
    readonly roomTitle: Locator;
    readonly roomImage: Locator;
    readonly bookingCalender: Locator;
    readonly roomDescription: Locator;
    readonly roomFeatures: Locator;
    readonly roomPolicies: Locator;
    readonly checkInCheckOutTime: Locator;

    constructor(page: any) {
        super(page); 
        this.roomTitle = page.locator('h1.fw-bold');
        this .roomImage = page.locator('img.hero-image');
        this.bookingCalender = page.locator('.card.border-0.shadow.booking-card');
        this.roomDescription = page.getByRole('heading', { name: 'Room Description' });
        this.roomFeatures = page.getByRole('heading', { name: 'Room Features' });
        this.roomPolicies = page.getByRole('heading', { name: 'Room Policies' });
        this.checkInCheckOutTime = page.getByRole('heading', { name: 'Check-in & Check-out' });
    }

    async verifyRoomTitle(expectedRoomName: string) {
        await expect(this.roomTitle).toHaveText(expectedRoomName);
    }

    async verifyRoomImageIsVisible() {
        await expect(this.roomImage).toBeVisible();
        await expect(this.roomImage).toHaveAttribute('alt', 'Room Image');
    }

    async verifyRoomDetails() {
        await expect(this.bookingCalender).toBeVisible();
        await expect(this.roomDescription).toBeVisible();
        await expect(this.roomFeatures).toBeVisible();
        await expect(this.roomPolicies).toBeVisible();
    }

    async verifyRoomPolicies() {
       await expect(this.roomPolicies).toBeVisible();
       await expect(this.checkInCheckOutTime).toBeVisible();
       const policies = [
            { label: 'Check-in:', value: '3:00 PM - 8:00 PM' },
            { label: 'Check-out:', value: 'By 11:00 AM' },
            { label: 'Early/Late:', value: 'By arrangement' }
        ];
        for (const policy of policies) {
           const policyRow = this.page.locator('li', { hasText: policy.label });
           await expect(policyRow).toContainText(policy.value);
           await expect(policyRow.locator('i.text-primary')).toBeVisible();
        }
    }
    }