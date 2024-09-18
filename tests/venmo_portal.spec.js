const fetchSecret = require('../js/secretfetcher');
const { test, chromium, playwright } = require('@playwright/test');

module.exports = async function venmoLogin(amount, description)
{
  const rooomieNames = ["Lorenzo-Santor", "davelmondares", "kevin-duke-5"];
  const userDataDir = 'C:\\Users\\chris\\Documents\\testprofile1';
  const secret = await fetchSecret();
  const secretJson = JSON.parse(secret);
  const browserContext = await chromium.launchPersistentContext(userDataDir, {
    args: [
      // Huge gains when you don't need visual output
      '--disable-gl-drawing-for-tests',
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });
  const page = await browserContext.newPage();
  page.setDefaultTimeout(120000);
  await page.goto("https://id.venmo.com/signin?country.x=US&locale.x=en#/lgn");
  await page.locator('//input[@id="password"]').fill(secretJson['VenmoPass']);
  await page.locator('//button[@id="btnLogin"]').click();
  await page.locator('//a[@href="/pay"]').click();
  const searchInput = page.locator('//input[@id="search-input"]');
  let returnString = 'Charged ';
  for await(let name of rooomieNames)
  {
    returnString = returnString + name + ', ';
    await searchInput.fill(name);
    await sleep(2000);
    const firstOption = page.locator('//ul//li[@id="search-input-option-0"]');
    await firstOption.hover();
    await sleep(2000);
    await firstOption.click();
  }
  const lastCommaIndex = returnString.lastIndexOf(',', returnString.length - 1, 0);
  returnString = returnString.slice(0, lastCommaIndex) + ' $' + amount + ' each.\rDescription: ' + description; 
  await page.getByPlaceholder("What's this for?").fill(description);
  await page.getByLabel("Amount").fill(amount);
  const requestButton = page.getByText('Request', {exact: true}).locator('..');
  await requestButton. click();
  await requestButton.click();
  await page.locator('//a[@href="/account/logout"]').click();
  await browserContext.close();
  return returnString;
}

function sleep(ms)
{
  return new Promise(resolve=>setTimeout(resolve, ms));
}

