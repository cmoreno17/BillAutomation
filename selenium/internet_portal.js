const {By, Builder, Browser, until} = require('selenium-webdriver');
const fetchSecret = require('../js/secretfetcher');
const firefox = require('selenium-webdriver/firefox');
const proxy = require('selenium-webdriver/proxy');
module.exports = async function internetLogin()
{
    const secret = await fetchSecret();
    const secretJson = JSON.parse(secret);
    const proxyServer = 'http://152.26.231.42:9443'
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
        //options.addArguments('--headless');
        driver = await new Builder().forBrowser(Browser.FIREFOX).setFirefoxOptions(options).build();
        //.setProxy(proxy.manual({http: proxyServer, https: proxyServer}))
        await driver.get("https://www.spectrum.net/");
        console.log('Webpage loaded.');
        await driver.manage().setTimeouts({implicit: 120000});
        await driver.wait(until.elementLocated(By.className('kite-button kite-button--primary')));
        const signInButton = await driver.findElement(By.className('kite-button kite-button--primary'));
        await signInButton.click();
        const userName = await driver.findElement(By.id('kite-label-input-4'));
        await userName.sendKeys(secretJson.InternetUser);
        await driver.wait(async () => {
            const value = await userName.getAttribute('value');
            return value.length > 0;
          }, 120000);
        const password = await driver.findElement(By.id('kite-label-input-6'));
        await driver.wait(until.elementIsEnabled(password));
        await password.sendKeys(secretJson.InternetPassword);
        await driver.wait(async () => {
            const value = await password.getAttribute('value');
            return value.length > 0;
          }, 120000);
        await driver.wait(until.elementLocated(By.className('kite-button kite-button--primary')));
        const secondSignInButton = await driver.findElement(By.className('kite-button kite-button--primary'));
        await driver.wait(until.elementIsEnabled(secondSignInButton));
        await secondSignInButton.click();
        await driver.wait(until.elementLocated(By.xpath('//button[@class="kite-button--secondary"]')));
        const goToBilling = await driver.findElement(By.xpath('//button[@class="kite-button--secondary"]'));
        await driver.wait(until.elementIsEnabled(goToBilling), 10000);
        const billingButton = await driver.findElement(By.xpath('//div[@aria-label="Billing"]'));
        console.log('Login successful');
        await billingButton.click();
        const activityButton = await driver.findElement(By.id('kite-tab-label-11'));
        await activityButton.click();
        const closeButton = await driver.findElement(By.xpath('//div[@aria-label="Close"]'));
        await closeButton.click();
        const payments = await driver.findElement(By.xpath('//span[text() = "Payments"]'));
        console.log('Opening payments screen');
        await payments.click();
    }
    catch(e)
    {
        console.log(e);
    }
    finally
    {
        const latestPaymentDate = await driver.findElement(By.xpath('//div[@class="payment-history ng-star-inserted"]//kite-table//div//table//tbody//tr[1]//td[1]')).getText();
        const latestPaymentAmount = await driver.findElement(By.xpath('//div[@class="payment-history ng-star-inserted"]//kite-table//div//table//tbody//tr[1]//td[@class="right-aligned"]')).getText();
        await driver.quit();
        console.log('{"latest_internet_bill_date": "' + latestPaymentDate + '", "latest_internet_bill_amount": "' + latestPaymentAmount + '"}');
        return '{"latest_internet_bill_date": "' + latestPaymentDate + '", "latest_internet_bill_amount": "' + latestPaymentAmount + '"}';
    }
}

function sleep(ms)
{
return new Promise(resolve=>setTimeout(resolve, ms));
}