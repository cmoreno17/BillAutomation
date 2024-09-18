const {By, Builder, Browser, until} = require('selenium-webdriver');
const fetchSecret = require('../js/secretfetcher');
const firefox = require('selenium-webdriver/firefox');
const proxy = require('selenium-webdriver/proxy');
module.exports = async function waterLogin()
{
    const secret = await fetchSecret();
    const secretJson = JSON.parse(secret);
    let driver;
    try
    {
        const options = new firefox.Options();
        options.addArguments('--disable-blink-features=AutomationControlled');
        options.addArguments('--disable-extensions');
        options.addArguments('--disable-infobars');
        options.addArguments('--disable-popup-blocking');
        options.addArguments('--disable-automation');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--disable-gpu');
        options.addArguments('--width=1920');
        options.addArguments('--height=1080');
        options.addArguments(['user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"']);
       // options.addArguments('--headless');
        driver = await new Builder().forBrowser(Browser.FIREFOX).setFirefoxOptions(options).build();

        await driver.get("https://customerportal.sandiego.gov/portal");
        console.log('Webpage loaded.');
        await driver.manage().setTimeouts({implicit: 120000});
        await driver.wait(until.titleIs('MyWaterSD :Login'));
        await driver.wait(until.elementLocated(By.xpath('//input[@name="txtLogin"]')));
        const loginBox = await driver.findElement(By.xpath('//input[@name="txtLogin"]'));
        await loginBox.sendKeys(secretJson['WaterUsername']);
        await driver.wait(async () => {
            const value = await loginBox.getAttribute('value');
            return value.length > 0;
          }, 120000);
        const passwordBox = await driver.findElement(By.xpath('//input[@name="txtpwd"]'));
        await driver.wait(until.elementIsEnabled(passwordBox));
        passwordBox.sendKeys(secretJson['WaterPassword']);
        await driver.wait(async () => {
            const value = await passwordBox.getAttribute('value');
            return value.length > 0;
          }, 120000);
        await driver.wait(until.elementLocated(By.xpath('//input[@name="btnlogin"]')));
        const loginButton = await driver.findElement(By.xpath('//input[@name="btnlogin"]'));
        await driver.wait(until.elementIsEnabled(loginButton));
        await loginButton.click();
        await driver.wait(until.titleIs('Dashboard'));
        const billingButton = await driver.findElement(By.xpath('//li[@class="billing dropicon"]'));
        console.log('Login successful');
        await billingButton.click();
        const billingHistory = await driver.findElement(By.xpath('//li[@class="icon_history list-group-item"]'));
        console.log('Opening billing history');
        await billingHistory.click();
    }
    catch(e)
    {
        console.log(e);
    }
    finally
    {
        const billDate = await driver.findElement(By.xpath('//table/tbody/tr[1]/td[@class="sorting_1"]')).getText();
        const billAmount = await driver.findElement(By.xpath('//table/tbody/tr[1]/td[@id="tbltdBillingHistoryAmount0"]')).getText();
        await driver.quit();
        const results = '{"latest_water_bill_date": "' + billDate + '", "latest_water_bill_amount": "' + billAmount + '"}';
        console.log(results);
        return results;
    }
}

async function retryWithBackoff(fn, retries = 5, delay = 1000) 
{
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (e) {
        await new Promise(r => setTimeout(r, delay));
        delay *= 2;  // Exponential backoff
      }
    }
    throw new Error('Failed after retries');
  }