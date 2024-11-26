import { chromium } from 'playwright-chromium';
import { expect } from 'chai';

const homeUrl = 'http://localhost:3000';
let browser, page;

before(async () => { browser = await chromium.launch({headless: true, slowMo: 0}) });
beforeEach(async () => { page = await browser.newPage() });
afterEach(async () => { await page.close() });
after(async () => { await browser.close() });

describe('Home Page', async () => {
    it('Should load the home page catalog', async () => {
        // Act
        await page.goto(homeUrl);

        // Assert
        const isVisible = await page.isVisible('#home-section')
        expect(isVisible).to.be.true;
    });

    it('Should load details page', async () => {
        await page.goto(homeUrl);

        await page.click('#home-section article:first-of-type');
        await page.waitForLoadState();

        expect(await page.isVisible('div.ingredients')).to.be.true;
    });
});
