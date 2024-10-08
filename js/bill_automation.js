const getElectricBillsJson = require('./bill_sniffer');
const Fs = require('fs');
const fetchSecret = require('./secretfetcher');
const internetLogin = require ('../selenium/internet_portal');
const waterLogin = require('../selenium/water_portal');

class BillAutomation
{
  #mRoommates = 4;
  
  async checkForUpdates()
  {
    const secretJson = JSON.parse(await fetchSecret());
    const electricData = await getElectricBillsJson(secretJson.ElectricToken);
    const prevWebbotData = JSON.parse(Fs.readFileSync('./WebbotData.json'));
    let billTotal = 0;
    let description = "";
    if(electricData.bill_start_date !== prevWebbotData.bill_start_date)
    {
      const appendedObject = Object.assign({}, electricData, prevWebbotData)
      Fs.writeFileSync('./WebbotData.json', JSON.stringify(appendedObject));
      const electricBill = Math.round(parseFloat(electricData.bill_total_cost) * 100) / 100;
      billTotal = Math.round((billTotal + electricBill)* 100) / 100;
      description = description + "Electric Bill " + electricData.bill_end_date.toString().split('T')[0] + ", ";
    }
    console.log('Running Water and Internet utilities login bots...');
    const waterData = await waterLogin();
    const internetData = await internetLogin();
    //const waterData = await waterPromise;
    //const internetData = await internetPromise;
    const waterString = waterData.replaceAll('\'', '"').replaceAll('$ ', '');
    const waterJson = JSON.parse(waterString);
    const internetString = internetData.replaceAll(' "', '"').replaceAll('" ', '"').replaceAll('$', '');
    const internetJson = JSON.parse(internetString);
    if(waterJson.latest_water_bill_date !== prevWebbotData.latest_water_bill_date)
    {
      //new bill is here
      prevWebbotData.latest_water_bill_date = waterJson.latest_water_bill_date;
      prevWebbotData.latest_water_bill_amount = waterJson.latest_water_bill_amount;
      Fs.writeFileSync('./WebbotData.json', JSON.stringify(prevWebbotData));
      const waterBill = Math.round(parseFloat(waterJson.latest_water_bill_amount)* 100) / 100;
      billTotal = Math.round((billTotal + waterBill) * 100) / 100;
      const latestBillString = waterJson.latest_water_bill_date.toString().replaceAll('/', '-')
      description = description + "Water Bill " + latestBillString + ", ";
    }
    if(internetJson.latest_internet_bill_date !== prevWebbotData.latest_internet_bill_date)
    {
      prevWebbotData.latest_internet_bill_date = internetJson.latest_internet_bill_date;
      prevWebbotData.latest_internet_bill_amount = Math.abs(internetJson.latest_internet_bill_amount).toString();
      Fs.writeFileSync('./WebbotData.json', JSON.stringify(prevWebbotData));
      const internetBill = Math.round(Math.abs(parseFloat(internetJson.latest_internet_bill_amount))* 100) / 100;
      billTotal = Math.round((billTotal + internetBill) * 100) / 100;
      const latestBillString = internetJson.latest_internet_bill_date.toString().replaceAll('/', '-')
      description = description + "Internet Bill " + latestBillString + ", ";
    }
    
    description = description.slice(0,description.lastIndexOf(','));
    return [billTotal, description];
  }

  splitBills(latestBill)
  {
    return Math.round((latestBill / this.#mRoommates)*100) / 100;
  }
}

module.exports  = BillAutomation;
