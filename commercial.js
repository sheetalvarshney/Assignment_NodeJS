const readline = require('readline');
const fs = require('fs');
let jsonFile=fs.createWriteStream('./json/Commercial.json');//write json into Commercial.json
let aggregate=[];
let head =[];
let Production_sum;
const rl = readline.createInterface({input: fs.createReadStream('./csv/Production-Department_of_Agriculture_and_Cooperation_1.csv','utf8')});
rl.on('line', (line)=>{
  let arr=line.split(',');
  if(/Particulars/.test(arr[0])) {
    head = arr;
  }
  if(/Commercial/.test(arr[0])) {
       aggregate.push(arr);
  }
});
rl.on('close', function(){
    let temp =0,sum=0,output=[],i;
    for(i=4;i<aggregate[0].length;i++){
    while(temp<aggregate.length) {
      if(aggregate[temp][i]!="NA") {
      sum = sum + parseFloat(aggregate[temp][i]);
    }
      temp++;
    }   
      output.push({
        year : head[i],
        value : sum
      })
    temp=0;
    sum=0;
    }
    console.log(output);
    jsonFile.write(JSON.stringify(output,null,2),'UTF-8');
});