const fetchSecret = require('../js/secretfetcher');
const { test, firefox, playwright } = require('@playwright/test');

module.exports = async function waterLogin() {
  const secret = await fetchSecret();
  const secretJson = JSON.parse(secret);
  const browser = await firefox.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://customerportal.sandiego.gov/portal");
  await page.getByTitle('Click to enter username', {exact: true}).fill(secretJson['WaterUsername']);
  await page.getByTitle('Click to enter password', {exact: true}).fill(secretJson['WaterPassword']);
  await page.getByTitle('Sign in to your existing account', {exact: true}).click();
  await page.getByTitle("Click to navigate to 'Billing' module").locator('..').click();
  await page.locator('//li[@class="icon_history list-group-item"]').click();
  const billDate = await page.locator('//table/tbody/tr[1]/td[@class="sorting_1"]').textContent();
  const billAmount = await page.locator('//table/tbody/tr[1]/td[@id="tbltdBillingHistoryAmount0"]').textContent();
  await browser.close();
  return '{"latest_water_bill_date": "' + billDate + '", "latest_water_bill_amount": "' + billAmount + '"}'
}
