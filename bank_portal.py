from selenium import webdriver as wd
from selenium.webdriver import ChromeOptions
from selenium.webdriver import ChromeService
import pandas as pd
import time
import json
from secret import get_secret
from selenium.webdriver.common.action_chains import ActionChains
import sys

rooomieNames = ["Lorenzo-Santor", "davelmondares", "kevin-duke-5"]
secret = get_secret()
secretJson = json.loads(secret)
opts = ChromeOptions()
service = ChromeService(executable_path="C:\\workspace\\NodeJSProjects\\BillCalculator\\chromedriver-win64\\chromedriver.exe")
opts.add_experimental_option("debuggerAddress", "127.0.0.1:8989")
wb = wd.Chrome(service=service,options=opts)
wb.implicitly_wait(10)
wb.get("https://id.venmo.com/signin?country.x=US&locale.x=en#/lgn")
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
  time.sleep(2)
  click.perform()
paymentNote  = wb.find_element("xpath", '/html/body/div/div/div[1]/div/div/main/div/div[3]/form/div[3]/div/div/div/textarea')
paymentNote.send_keys(sys.argv[2])
requestAmount = wb.find_element("xpath", '/html/body/div/div/div[1]/div/div/main/div/div[3]/form/div[1]/div/div/input')
requestAmount.send_keys(sys.argv[1])
requestButton = wb.find_element("xpath", '/html/body/div/div/div[1]/div/div/main/div/div[3]/form/div[5]/button[2]')
requestButton.click()
time.sleep(3000)