function showResult(id,text){

let box=document.getElementById(id);
box.style.display="block";
box.innerHTML=text;

}

/* BMI */

function calculateBMI(){

let weight=document.getElementById("weight").value;
let weight_unit=document.getElementById("weight_unit").value;

let height_unit=document.getElementById("height_unit").value;

let height;

if(weight_unit==="lb"){
weight=weight*0.453592;
}

if(height_unit==="cm"){
height=document.getElementById("height").value/100;
}
else{
let ft=document.getElementById("height_ft").value;
let inches=document.getElementById("height_in").value;

height=((ft*12)+parseFloat(inches))*0.0254;
}

let bmi=weight/(height*height);

document.getElementById("bmi_result").innerHTML="BMI: "+bmi.toFixed(2);

}

}


/* AGE */

function calculateAge(){

let birth=new Date(document.getElementById("birthdate").value);
let today=new Date();

let age=today.getFullYear()-birth.getFullYear();

let m=today.getMonth()-birth.getMonth();

if(m<0 || (m===0 && today.getDate()<birth.getDate())){
age--;
}

showResult("age_result","Age: "+age+" years");

}


/* WATER */

function calculateWater(){

let w=parseFloat(document.getElementById("water_w").value);

if(isNaN(w)){
showResult("water_result","Enter valid weight");
return;
}

let water=(w*0.033).toFixed(2);

showResult("water_result","Daily water: "+water+" L");

}


/* PERCENTAGE */

function calculatePercentage(){

let value=parseFloat(document.getElementById("percent_value").value);
let total=parseFloat(document.getElementById("percent_total").value);

if(total===0){
showResult("percent_result","Total cannot be zero");
return;
}

let result=(value/total)*100;

showResult("percent_result",result.toFixed(2)+"%");

}


/* BODY FAT */

function calculateBodyFat(){

let gender=document.getElementById("bf_gender").value;
let waist=parseFloat(document.getElementById("bf_waist").value);
let neck=parseFloat(document.getElementById("bf_neck").value);
let height=parseFloat(document.getElementById("bf_height").value);
let hip=parseFloat(document.getElementById("bf_hip").value);

let bf;

if(gender==="male"){
bf = 86.010*Math.log10(waist-neck) - 70.041*Math.log10(height) + 36.76;
}

else{
bf = 163.205*Math.log10(waist+hip-neck) - 97.684*Math.log10(height) - 78.387;
}

showResult("bf_result","Estimated Body Fat: "+bf.toFixed(1)+"%");
}

/* BMR */

function calculateBMR(){

let gender=document.getElementById("bmr_gender").value;
let age=parseFloat(document.getElementById("bmr_age").value);
let w=parseFloat(document.getElementById("bmr_w").value);
let h=parseFloat(document.getElementById("bmr_h").value);

let bmr;

if(gender==="male")
bmr=10*w+6.25*h-5*age+5;
else
bmr=10*w+6.25*h-5*age-161;

showResult("bmr_result","BMR: "+Math.round(bmr)+" calories/day");

}


/* TDEE */

function calculateTDEE(){

let gender=document.getElementById("gender").value;
let age=parseFloat(document.getElementById("age").value);
let w=parseFloat(document.getElementById("weight").value);
let h=parseFloat(document.getElementById("height").value);
let act=parseFloat(document.getElementById("activity").value);

let bmr;

if(gender==="male")
bmr=10*w+6.25*h-5*age+5;
else
bmr=10*w+6.25*h-5*age-161;

let tdee=bmr*act;

showResult("tdee_result","Daily calories: "+Math.round(tdee));

}


/* MACROS */

function calculateMacros(){

let gender=document.getElementById("mac_gender").value;
let age=parseFloat(document.getElementById("mac_age").value);
let w=parseFloat(document.getElementById("mac_w").value);
let h=parseFloat(document.getElementById("mac_h").value);
let act=parseFloat(document.getElementById("mac_activity").value);
let goal=parseFloat(document.getElementById("mac_goal").value);

let bmr;

if(gender==="male")
bmr=10*w+6.25*h-5*age+5;
else
bmr=10*w+6.25*h-5*age-161;

let calories=bmr*act+goal;

let protein=(calories*0.30)/4;
let carbs=(calories*0.40)/4;
let fat=(calories*0.30)/9;

showResult("mac_result",
"Calories: "+Math.round(calories)+"<br>"+
"Protein: "+Math.round(protein)+" g<br>"+
"Carbs: "+Math.round(carbs)+" g<br>"+
"Fat: "+Math.round(fat)+" g");


}
function toggleBMIUnit(){

let unit=document.getElementById("unit").value;

if(unit==="metric"){
document.getElementById("metricInputs").style.display="block";
document.getElementById("imperialInputs").style.display="none";
}
else{
document.getElementById("metricInputs").style.display="none";
document.getElementById("imperialInputs").style.display="block";
}

}
function toggleHeightInputs(){

let unit=document.getElementById("height_unit").value;

if(unit==="cm"){
document.getElementById("height_cm").style.display="block";
document.getElementById("height_ft").style.display="none";
}
else{
document.getElementById("height_cm").style.display="none";
document.getElementById("height_ft").style.display="block";
}

}

