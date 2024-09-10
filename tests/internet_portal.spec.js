const fetchSecret = require('../js/secretfetcher');
const { test, firefox, playwright } = require('@playwright/test');

module.exports = async function internetLogin() {
  const secret = await fetchSecret();
  const secretJson = JSON.parse(secret);
  const browser = await firefox.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://www.spectrum.net/");
  await page.getByText('Sign In', {exact: true}).click();
  await page.locator('//input[@name="kite-label-input-4"]').fill(secretJson.InternetUser);
  await page.locator('//input[@name="kite-label-input-6"]').fill(secretJson.InternetPassword);
  await page.locator('//button[@type="submit"]').click();
  await page.locator('//div[@aria-label="Close"]').click();
  await page.locator('//div[@aria-label="Billing"]').click();
  await page.locator('//button[@id="kite-tab-label-11"]').click();
  await page.getByText('Payments').locator('..').locator('..').locator('..').click();
  const latestPaymentDate = await page.locator('//div[@class="payment-history ng-star-inserted"]//kite-table//div//table//tbody//tr[1]//td[1]').textContent();
  const latestPaymentAmount = await page.locator('//div[@class="payment-history ng-star-inserted"]//kite-table//div//table//tbody//tr[1]//td[@class="right-aligned"]').textContent();
  await browser.close();
  return '{"latest_internet_bill_date": "' + latestPaymentDate + '", "latest_internet_bill_amount": "' + latestPaymentAmount + '"}'
}
