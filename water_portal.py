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
wb.get("https://customerportal.sandiego.gov/portal")
username = wb.find_element("xpath", '//input[@id="txtLogin"]')
username.send_keys(secretJson['WaterUsername'])
password = wb.find_element("xpath", '//input[@id="txtpwd"]')
password.send_keys(secretJson['WaterPassword'])
signInButton = wb.find_element("xpath", '//input[@id="btnlogin"]')
signInButton.click()
wb.implicitly_wait(10)
billingButton = wb.find_element("class name", 'billing.dropicon')
billingButton.click()
historyButton = wb.find_element("class name", 'icon_history.list-group-item')
historyButton.click()
latestBill = wb.find_element("xpath", '//td[@id="tbltdBillingHistoryAmount0"]')
latestBillDate = wb.find_element("xpath", '//table//tbody//tr//td[@class="sorting_1"]').accessible_name
print ({"latest_water_bill_date": latestBillDate, "latest_water_bill_amount": latestBill.text})




# Use this code snippet in your app.
# If you need more information about configurations
# or implementing the sample code, visit the AWS docs:
# https://aws.amazon.com/developer/language/python/



