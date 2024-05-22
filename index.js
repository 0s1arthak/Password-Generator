const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");


// 4 checkboxes will be having inside the following variable
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


// Starting mein koi password nhi hai
let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
setIndicator("#ccc");
// slider ka kaam password ki length
// handle slider --> sets password's length, let us first build this


// function for handling the slider, the element that we fetched we gave it the input value as passwordLength
// which is visible at first and can be edited later

// Does 2 works
// 1-> slider ki value change karega
// 2-> aurr jo number tha usko bhi change karega
function handleSlider(){
      inputSlider.value=passwordLength;
      lengthDisplay.innerText=passwordLength;

      const min=inputSlider.min;
      const max=inputSlider.max;

      inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"%100%";
}


// We set the color of the indicator and shadow 
function setIndicator(color) {
      indicator.style.backgroundColor = color;
      //shadow - HW
      indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
  }
// function for generating a random function int the range provided in the parameter
function getRndInteger(min,max){
      return Math.floor(Math.random()*(max-min)) + min;
}
// Generating random digit from 0 to 9
function generateRandomNumber(){
      return getRndInteger(0,9);
}


// Generating a lower case letter 
function generateLowerCase(){
      return String.fromCharCode(getRndInteger(97,123));
}


// Upper case letter
function generateUpperCase(){
      return String.fromCharCode(getRndInteger(65,91))
}

// Choosing the symbol from a string by firstly generating 
// a random number from 0 to length of the string
function generateSymbol(){
      const randNum=getRndInteger(0,symbols.length);
      return symbols.charAt(randNum);
}

// Wrote a function to set the strength on the basis of boxes checked 
function calcStrength(){
      let hasUpper=false;
      let hasLower=false;
      let hasNum=false;
      let hasSym=false;
      // .checked-->ticked or not
      if(uppercaseCheck.checked)hasUpper=true;
      if(lowercaseCheck.checked)hasLower=true;
      if(numbersCheck.checked) hasNum=true;
      if(symbolsCheck.checked) hasSym=true;

      if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
            setIndicator("#0f0");
      } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
      ) {
      setIndicator("#ff0");
      } else {
      setIndicator("#f00");
      }
}

// Copying content to clipboard it is an async function that is why we are using asyn fucntion to execute it and 
// that function returns a promise (either it is resolved or rejected ) and we have await keyword to show copied message
// only when promise is resolved 

// One more thing to observe that when the copied message is shown it vanishes which means that it has timeout 
async function copyContent() {
      try {
          await navigator.clipboard.writeText(passwordDisplay.value);
          copyMsg.innerText = "copied";
      }
      catch(e) {
          copyMsg.innerText = "Failed";
      }
      //to make copy wala span visible
      copyMsg.classList.add("active");
  
      setTimeout( () => {
          copyMsg.classList.remove("active");
      },2000);
  
  }





// Event listeners
// 1 -> on slider
// 2 -> on generate password button
// 3 -> copy button


// Since we cannot generate password until we have checked at least one of the checkboxes so we have to
// apply eventListener to keep the track of a count variable that stores the count of how many checkboxes we have ticked


// we have all the checkboxes in an array when we fetched them using queryselectorAll
// So applying eventListener on all of them

function handleCheckBoxChange(){
      checkCount=0;
      allCheckBox.forEach((checkbox)=>{
            if(checkbox.checked)
                  checkCount++;
      });

      // Special condition
      if(checkCount>passwordLength){
            passwordLength=checkCount;
            handleSlider();
      }
}

function shufflePassword(array) {
      //Fisher Yates Method
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
      let str = "";
      array.forEach((el) => (str += el));
      return str;
  }

allCheckBox.forEach((checkbox)=>{
      checkbox.addEventListener('change',handleCheckBoxChange)
})




inputSlider.addEventListener('input',(e)=>{
      // e is the slider element

      // Basically,we copied the changed value in passwordLength then called handleslider 
      // function so that it can make changes to the ui
      passwordLength=e.target.value;
      handleSlider();
})

copyBtn.addEventListener('click',()=>{
      if(passwordDisplay.value)
            copyContent();
})


generateBtn.addEventListener('click',()=>{
      // If 
      if(checkCount==0)
            return;
      if(passwordLength<checkCount){
            passwordLength=checkCount;
            handleSlider();
      }

      console.log("Starting the Journey");
      password="";
      let funcArr=[];
      // Fulfilling necessary conditons

      // if(uppercaseCheck.checked){
      //       password+=generateUpperCase();
      // }
      // if(lowercaseCheck.checked){
      //       password+=generateLowerCase();
      // }
      // if(numbersCheck.checked){
      //       password+=generateRandomNumber();
      // }
      // if(symbolsCheck.checked){
      //       password+=generateSymbol();
      // }
      if(uppercaseCheck.checked){
            funcArr.push(generateUpperCase);
      }
      if(lowercaseCheck.checked){
            funcArr.push(generateLowerCase);
      }
      if(numbersCheck.checked){
            funcArr.push(generateRandomNumber);
      }
      if(symbolsCheck.checked){
            funcArr.push(generateSymbol);
      }

      // Fulfilling compulsory steps
      for(let i=0;i<funcArr.length;i++){
            password+=funcArr[i]();
      }
      console.log("COmpulsory adddition done");

      for(let i=0;i<passwordLength-funcArr.length;i++){
            let rndindex=getRndInteger(0,funcArr.length);
            console.log("randIndex" + rndindex);
            password+=funcArr[rndindex]();
      }
      console.log("Remaining adddition done");
      // Shuffle the password
      // We are sending the password in the form of array in the argument
      password=shufflePassword(Array.from(password));
      console.log("Shuffling done");
      // Show in UI
      passwordDisplay.value=password;
      console.log("UI adddition done");
      // calculate strength
      calcStrength();

});