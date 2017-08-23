const readline = require('readline');
const fs = require('fs');
let oilseeds_type=[]; //type of oilseeds crop
let sorted_Oilseeds_type=[];
let oilseed_production_2013=[];    //production of year 2013
let oilseed_sorted_Production=[]; //sorted in descending order
let oilseedJsonFile=fs.createWriteStream('../json/Oilseeds.json');
let oilseed_output=[];
let foodgrains_type=[]; //type of oilseeds crop
let sorted_foodgrains_type=[];
let foodgrain_production_2013=[];        //production of year 2013
let foodgrain_sorted_Production=[];   //sorted in descending order
let foodgrainJsonFile=fs.createWriteStream('../json/Foodgrains.json');
let foodgrain_output=[];
let commercialJsonFile=fs.createWriteStream('../json/Commercial.json');//write json into Commercial.json
let aggregate=[];
let head =[];
let Production_sum;
let commercial_output=[];
let Rice_karnataka=[],Rice_kerala=[],Rice_tamil=[],Rice_andhra=[]; 
let states=[],Production=[],years=[];
let temp=0,sum=0;
let riceJsonFile=fs.createWriteStream('../json/Rice.json');
for(var i=0; i<22; i++){Rice_andhra[i]=Rice_tamil[i]=Rice_karnataka[i]=Rice_kerala[i]=0;}
const rl = readline.createInterface({
  input: fs.createReadStream('../csv/Production-Department_of_Agriculture_and_Cooperation_1.csv','utf8')
});
rl.on('line', (line)=>{
  let arr=line.split(',');
  if(/Oilseeds/.test(arr[0]) && arr[24]!="NA"){//filter for oilseed crops
     oilseeds_type.push(arr[0]);
     oilseed_production_2013.push(parseFloat(arr[24]));
     for(let i=0;i<=oilseed_production_2013.length-1;i++){//loop for sorting
        for(let j=0;j<=oilseed_production_2013.length-2;j++){
          if(oilseed_production_2013[j]<=oilseed_production_2013[j+1]){
            let temp=oilseed_production_2013[j];
            oilseed_production_2013[j]=oilseed_production_2013[j+1];
            oilseed_production_2013[j+1]=temp;
            let temp1=oilseeds_type[j];         //values of oilseeds_type array 
            oilseeds_type[j]=oilseeds_type[j+1];//corresponding to sorted production_2013
            oilseeds_type[j+1]=temp1;  
          }
        }
     }
     for(let i=0;i<oilseed_production_2013.length;i++){
      oilseed_sorted_Production[i]=oilseed_production_2013[i];
      sorted_Oilseeds_type[i]=oilseeds_type[i];
    }
  }
  if(/Foodgrains/.test(arr[0]) && arr[24]!="NA"){//filter for Foodgrains
     foodgrains_type.push(arr[0]);
     foodgrain_production_2013.push(parseFloat(arr[24]));
     for(let i=0;i<=foodgrain_production_2013.length-1;i++){//loop for sorting
        for(let j=0;j<=foodgrain_production_2013.length-2;j++){
          if(foodgrain_production_2013[j]<=foodgrain_production_2013[j+1]){
            let temp=foodgrain_production_2013[j];
            foodgrain_production_2013[j]=foodgrain_production_2013[j+1];
            foodgrain_production_2013[j+1]=temp;
            let temp1=foodgrains_type[j];
            foodgrains_type[j]=foodgrains_type[j+1];
            foodgrains_type[j+1]=temp1;  
          }//end of if condition
        }//end of j loop
     }//end of i loop
     for(let i=0;i<foodgrain_production_2013.length;i++){
      foodgrain_sorted_Production[i]=foodgrain_production_2013[i];
      sorted_foodgrains_type[i]=foodgrains_type[i];
    }
  }
 if(/Particulars/.test(arr[0])) {
    head = arr;
  }
  if(/Commercial/.test(arr[0])) {
       aggregate.push(arr);
  }
  if(/Particulars/.test(arr[0])) {
    head = arr;
  }
  if(/Rice/.test(arr[0])){
    for(let i=4;i<head.length;i++){
      if((/Tamil Nadu/.test(arr[0]))&&(arr[i]!== "NA")){
        Rice_tamil[i-4]+=parseInt(arr[i]);
      }
       if((/Karnataka/.test(arr[0]))&&(arr[i]!== "NA")){
        Rice_karnataka[i-4]+=parseInt(arr[i]);
      }
       if((/Kerala/.test(arr[0]))&&(arr[i]!== "NA")){
        Rice_kerala[i-4]+=parseInt(arr[i]);
      }
       if((/Andhra Pradesh/.test(arr[0]))&&(arr[i]!== "NA")){
        Rice_andhra[i-4]+=parseInt(arr[i]);
      }
    }
}
});
rl.on('close', function(){
  let temp =0,sum=0,commercial_output=[];
    for( let i in oilseeds_type){
        oilseed_output.push({
          "Type":sorted_Oilseeds_type[i],
        "Production":oilseed_sorted_Production[i],
      });
    } 
      for( let i in foodgrains_type){
        foodgrain_output.push({
          "Type":sorted_foodgrains_type[i],
        "Production":foodgrain_sorted_Production[i],
      });
    }
      oilseedJsonFile.write(JSON.stringify(oilseed_output,null,2),'utf8'); 
      foodgrainJsonFile.write(JSON.stringify(foodgrain_output,null,2),'utf8');   
   let commercial_temp =0,i;
    for(i=4;i<aggregate[0].length-1;i++){
    while(commercial_temp<aggregate.length) {
      if(aggregate[commercial_temp][i]!="NA") {
      sum = sum + parseFloat(aggregate[commercial_temp][i]);

    }
      commercial_temp++;
    } 
      commercial_output.push({
        year : head[i],value : (sum/commercial_temp)
      });
    commercial_temp=0;
    sum=0,count=0;
    }
    commercialJsonFile.write(JSON.stringify(commercial_output,null,2),'UTF-8');
    let finalarray=new Array();
  let year;
  for(let i=0;i<head.length-3;i++)
  { year = i+1993
    yearlyrecord = {"Year": year, "Karnataka": Rice_karnataka[i], "Kerala" : Rice_kerala[i], "TamilNadu": Rice_tamil[i], "AndhraPradesh":Rice_andhra[i]};
    finalarray.push(yearlyrecord)
    }
 riceJsonFile.write(JSON.stringify(finalarray,null,2),'UTF-8');
});

