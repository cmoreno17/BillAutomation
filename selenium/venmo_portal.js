const {By, Builder, Browser, until} = require('selenium-webdriver');
const fetchSecret = require('../js/secretfetcher');
const chrome = require('selenium-webdriver/chrome');
const proxy = require('selenium-webdriver/proxy');

module.exports = async function venmoLogin(amount, description)
{
    const secret = await fetchSecret();
    const secretJson = JSON.parse(secret);
    const rooomieNames = ["Lorenzo-Santor", "davelmondares", "kevin-duke-5"];
    let driver;
    let returnString;
    try
    {
        const options = new chrome.Options();
        options.addArguments('--disable-blink-features=AutomationControlled');
        options.addArguments('--disable-extensions');
        options.addArguments('--disable-infobars');
        options.addArguments('--disable-popup-blocking');
        options.addArguments('--disable-automation');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--disable-gpu');
        options.addArguments('--width=2560');
        options.addArguments('--height=1440');
        options.addArguments('--user-data-dir=C:\\Users\\chris\\Documents\\testprofile1');
        options.addArguments(['user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"']);
        //options.addArguments('--no-startup-window');
        //options.addArguments('--no-first-run');
        //options.addArguments('--headless=new');
        //options.setPageLoadStrategy('none');
        driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();
        //.setProxy(proxy.manual({http: proxyServer, https: proxyServer}))

        await driver.get("https://id.venmo.com/signin?country.x=US&locale.x=en#/lgn");
        await driver.manage().setTimeouts({implicit: 12000});
        console.log('Webpage loaded.');
        const password = await driver.findElement(By.xpath('//input[@id="password"]'));
        await password.sendKeys(secretJson['VenmoPass']);
        const login = await driver.findElement(By.xpath('//button[@id="btnLogin"]'));
        await login.click();
        const pay = await driver.findElement(By.xpath('//a[@href="/pay"]'))
        console.log('Login successful');
        await pay.click();
        const searchInput = await driver.findElement(By.xpath('//input[@id="search-input"]'));
        returnString = 'Charged ';
        console.log('Adding recipients of payment request');
        for await(let name of rooomieNames)
        {
          returnString = returnString + name + ', ';
          await searchInput.sendKeys(name);
          await sleep(2000);
          const firstOption = driver.findElement(By.xpath('//ul//li[@id="search-input-option-0"]'));
          await driver.actions().move(firstOption).perform();
          await sleep(2000);
          await firstOption.click();
        }
        const lastCommaIndex = returnString.lastIndexOf(',', returnString.length - 1, 0);
        returnString = returnString.slice(0, lastCommaIndex) + ' $' + amount + ' each.\rDescription: ' + description; 
        const descriptionBox = await driver.findElement(By.id('payment-note'));
        await descriptionBox.sendKeys(description);
        const amountBox = await driver.findElement(By.xpath('//input[@aria-label="Amount"]'));
        await amountBox.sendKeys(amount);
        const requestButton = await driver.findElement(By.xpath('//button[@type="submit"]'));
        await requestButton.click();
        driver.wait(until.elementIsClickable(requestButton), 10000);
        await requestButton.click();
      
      function sleep(ms)
      {
        return new Promise(resolve=>setTimeout(resolve, ms));
      }
    }
    catch(e)
    {
        console.log(e);
    }
    finally
    {
        await driver.quit();
        return returnString;
    }
}