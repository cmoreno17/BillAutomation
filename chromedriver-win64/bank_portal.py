from selenium import webdriver as wd
from selenium.webdriver import ChromeOptions
import pandas as pd
import time
import json
from secret import get_secret
from selenium.webdriver.common.action_chains import ActionChains

rooomieNames = ["Lorenzo-Santor", "davelmondares", "kevin-duke-5"]
secret = get_secret()
secretJson = json.loads(secret)
opts = ChromeOptions()
opts.add_argument("--exe")
opts.add_experimental_option("debuggerAddress", "localhost:8989")
opts.add_argument("--window-size=1920,1080")
wb = wd.Chrome(".\\chromedriver-win64\chromedriver.exe",options=opts)
wb.implicitly_wait(10)
wb.get("https://id.venmo.com/signin?country.x=US&locale.x=en#/lgn")
userId = wb.find_element("xpath", '//input[@name="login_email"]')
userId.send_keys(secretJson['VenmoUser'])
nextButton = wb.find_element("xpath", '//button[@id="btnNext"]')
nextButton.click()
password = wb.find_element("xpath", '//input[@id="password"]')
password.send_keys(secretJson['VenmoPass'])
loginButton = wb.find_element("xpath", '//button[@id="btnLogin"]')
loginButton.click()
payOrRequest = wb.find_element("xpath", '//a[@href="/pay"]')
payOrRequest.click()
toInput = wb.find_element("xpath", '//input[@id="search-input"]')
for name in rooomieNames:
  payNote = wb.find_element("xpath", '//div[@class="pay_note__KHCGO"]')
  hover = ActionChains(wb).move_to_element(payNote)
  click = ActionChains(wb).click(payNote)
  toInput.send_keys(name)
  hover.perform()
  click.perform()
  
# zelle = wb.find_element("xpath", '//div[@id="servicecard_1"]')
# zelle.click()

time.sleep(3000)