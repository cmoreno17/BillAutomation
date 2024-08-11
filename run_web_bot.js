const { exec } = require('child_process');

function runScript(scriptName)
{
  return new Promise((resolve, reject)=>
  {
    exec(scriptName, {env:process.env}, (error, stdout, stderr)=>{
      if(error)
      {
        console.error(`Error executing script: ${error.message}`);
        reject(error);
      }
      if(stderr)
      {
        console.error(`Script error: ${stderr}`);
        reject(stderr);
      }
      resolve(stdout.toString());
    });
  });   
}

module.exports=runScript;