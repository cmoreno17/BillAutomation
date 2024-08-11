const BillAutomation = require('./bill_automation');
const runScript = require('./run_web_bot');

const gBillAutomation = new BillAutomation();

function myDailyTask()
{
  gBillAutomation.checkForUpdates().then(billingInfo=>
  {
    if(billingInfo[0])
    {
      const billAmount = gBillAutomation.splitBills(billingInfo[0])
      runScript("python .\\bank_portal.py " + `"${billAmount}"` + " " + `"${billingInfo[1]}"`);
    }
  });
}

myDailyTask();


