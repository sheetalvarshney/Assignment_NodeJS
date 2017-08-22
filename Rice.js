const readline = require('readline');
const fs = require('fs');
let Rice=[],head=[]; 
let states=[],Production=[],years=[];
let jsonFile=fs.createWriteStream('./json/Rice.json');
let output={};
let temp=0;
const rl = readline.createInterface({input: fs.createReadStream('./csv/Production-Department_of_Agriculture_and_Cooperation_1.csv','utf8')});
rl.on('line', (line)=>{
  let arr=line.split(',');
  if(/Particulars/.test(arr[0])) {
    head = arr;
  }
  if(/Rice/.test(arr[0])){
    if((/Tamil Nadu/.test(arr[0]))||(/Kerala/.test(arr[0]))||(/Andhra Pradesh/.test(arr[0]))||(/Karnataka/.test(arr[0]))){
      Rice.push(arr[0])
      states.push(arr);
    }
  }
});
rl.on('close', function(){
  for(i in states){
    for(let j=4;j<states[i].length-1;j++){
      if(states[i][j]=="NA"){
      states[i][j]=0;
    }
    output[Rice[i]]=output[Rice[i]]||[];
    output[Rice[i]].push({
      "year":head[j],
      "value":states[i][j]
      });
    }
  }
 jsonFile.write(JSON.stringify(output,null,2),'UTF-8');
});
