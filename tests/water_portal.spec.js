const fetchSecret = require('../js/secretfetcher');
const { test, chromium, playwright } = require('@playwright/test');

module.exports = async function waterLogin(){
  const secret = await fetchSecret();
  const secretJson = JSON.parse(secret);
  const browser = await chromium.launch({
  args: [
    // Huge gains when you don't need visual output
    '--disable-gl-drawing-for-tests',
    '--no-sandbox',
    '--disable-setuid-sandbox',
  ],
});
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(120000);
  await page.goto("https://customerportal.sandiego.gov/portal");
  await page.locator('//input[@name="txtLogin"]').fill(secretJson['WaterUsername']);
  await page.locator('//input[@name="txtpwd"]').fill(secretJson['WaterPassword']);
  await page.locator('//input[@name="btnlogin"]').click();
  await page.getByTitle("Click to navigate to 'Billing' module").locator('..').click();
  await page.locator('//li[@class="icon_history list-group-item"]').click();
  const billDate = await page.locator('//table/tbody/tr[1]/td[@class="sorting_1"]').textContent();
  const billAmount = await page.locator('//table/tbody/tr[1]/td[@id="tbltdBillingHistoryAmount0"]').textContent();
  await browser.close();
  return '{"latest_water_bill_date": "' + billDate + '", "latest_water_bill_amount": "' + billAmount + '"}'
}
