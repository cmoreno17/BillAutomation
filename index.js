const BillAutomation = require('./js/bill_automation');
const runScript = require('./js/run_web_bot');
const sendEmail = require('./js/email_client');
const venmoLogin = require('./selenium/venmo_portal');

const gBillAutomation = new BillAutomation();

function myDailyTask()
{
  gBillAutomation.checkForUpdates().then(billingInfo=>
  {
    if(billingInfo[0])
    {
      console.log('Running venmo bot to charge roommates...');
      const billAmount = gBillAutomation.splitBills(billingInfo[0]);
      venmoLogin(billAmount.toString(), billingInfo[1])
      .then(result=>
      {
        console.log(result);
        sendEmail(result).catch(console.error);
      });
    }
    else
    {
      console.log('No new bills found, will check again tomorrow.');
    }
  });
}

myDailyTask();


