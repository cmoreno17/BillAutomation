const {https} = require('follow-redirects');
const Json5 = require('json5');

const meter_id= 1646918;

function getOptions(hostname, path, electricToken)
{
  const options = {
      hostname: hostname,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + electricToken
      },
    };
  return options;
}

function getElectricBillsJson(electricToken)
{ 
  return new Promise((resolve, reject)=>
  {
    let data = '';
    https.get(getOptions('utilityapi.com', '/api/v2/bills?meters=' + meter_id, electricToken), response => 
    {  
      response.on('data', chunk => 
      {
        data += chunk;
      });
      response.on('end', () => 
      {
        const dataJson = Json5.parse(data);
        console.log('Successfully retrieved latest electric bill data.');
        resolve(dataJson.bills[0].base);
      });
    })
    .on('error', err => 
    {
      console.error(err);
    });
  });   
}

module.exports =  getElectricBillsJson;