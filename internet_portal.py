from selenium import webdriver as wd
from selenium.webdriver import ChromeOptions
import pandas as pd
import time
import json
from secret import get_secret

secret = get_secret()
secretJson = json.loads(secret)
opts = ChromeOptions()
opts.add_argument("--window-size=1920,1080")
wb = wd.Chrome(options=opts)
wb.implicitly_wait(10)
wb.get("https://www.spectrum.net/")
signIn = wb.find_element("xpath", '//button[@class="kite-button kite-button--primary"]')
signIn.click()
userName = wb.find_element("xpath", '//input[@id="kite-label-input-4"]')
userName.send_keys(secretJson["InternetUser"])
password = wb.find_element("xpath", '//input[@id="kite-label-input-6"]')
password.send_keys(secretJson["InternetPassword"])
signInButton = wb.find_element("xpath", '//button[@type="submit"]')
signInButton.click()
billingButton = wb.find_element("xpath", '//button[@class="kite-button kite-button--secondary"]')
billingButton.click()
activityTab = wb.find_element("xpath", '//*[contains(text(), \'Activity\')]')
activityTab.click()
paymentTab = wb.find_element("xpath", '//*[contains(text(), \'Payments\')]')
paymentTab.click()
lastPaymentDate=wb.find_element("xpath", '//table//tbody//tr//td').text
lastPaymentAmount=wb.find_element("xpath", '//table//tbody//tr//td[@class="right-aligned"]').text
print({"latest_internet_bill_date": lastPaymentDate, "latest_internet_bill_amount": lastPaymentAmount})
