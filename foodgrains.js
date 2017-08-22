const readline = require('readline');
const fs = require('fs');
let foodgrains_type=[]; //type of oilseeds crop
let sorted_foodgrains_type=[];
let production_2013=[];        //production of year 2013
let sorted_Production=[];   //sorted in descending order
let jsonFile=fs.createWriteStream('./json/Foodgrains.json');
let output={};
const rl = readline.createInterface({input: fs.createReadStream('./csv/Production-Department_of_Agriculture_and_Cooperation_1.csv','utf8')});
rl.on('line', (line)=>{
  let arr=line.split(',');
  if(/Foodgrains/.test(arr[0]) && arr[24]!="NA"){//filter for Foodgrains
     foodgrains_type.push(arr[0]);
     production_2013.push(parseFloat(arr[24]));
     for(let i=0;i<=production_2013.length-1;i++){//loop for sorting
        for(let j=0;j<=production_2013.length-2;j++){
          if(production_2013[j]<=production_2013[j+1]){
            let temp=production_2013[j];
            production_2013[j]=production_2013[j+1];
            production_2013[j+1]=temp;
            let temp1=foodgrains_type[j];
            foodgrains_type[j]=foodgrains_type[j+1];
            foodgrains_type[j+1]=temp1;  
          }//end of if condition
        }//end of j loop
     }//end of i loop
     for(let i=0;i<production_2013.length;i++){
      sorted_Production[i]=production_2013[i];
      sorted_foodgrains_type[i]=foodgrains_type[i];
    }
  }
});
rl.on('close', function(){
    for( let i in foodgrains_type){
        output[sorted_foodgrains_type[i]]=[];
        output[sorted_foodgrains_type[i]].push({
        "Production":sorted_Production[i],
      })}
      jsonFile.write(JSON.stringify(output,null,2),'utf8');   
});

