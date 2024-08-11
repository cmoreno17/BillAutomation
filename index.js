const BillAutomation = require('./js/bill_automation');
const runScript = require('./js/run_web_bot');

const gBillAutomation = new BillAutomation();

function myDailyTask()
{
  gBillAutomation.checkForUpdates().then(billingInfo=>
  {
    if(billingInfo[0])
    {
      const billAmount = gBillAutomation.splitBills(billingInfo[0])
      runScript("python .\\py\\bank_portal.py " + `"${billAmount}"` + " " + `"${billingInfo[1]}"`);
    }
  });
}

myDailyTask();


