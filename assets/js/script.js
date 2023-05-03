const dropList = document.querySelectorAll(".drop-list select"),
fromCurrency = document.querySelector(".from select"),
toCurrency = document.querySelector(".to select"),
getButton = document.querySelector("form button");

const apiKey = `807baca05c93fa3fbb458cf2`;

for (let i = 0; i < dropList.length; i++) {
    for(currency_code in country_code){
        // selecting EUR by default as FROM currency and BRL as TO currency
        let selected;
        if(i==0){
            selected = currency_code == "EUR" ? "selected" : "";
        }else if(i == 1){
            selected = currency_code == "BRL" ? "selected" : "";
        }
        // creating option tag with passing currency code as a text and value
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        // inserting options tag inside select tag
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e =>{
        loadFlag(e.target); // Calling loadFlag with passing target element as an argument
    });
}

function loadFlag(element){
    for(code in country_code){
        if(code == element.value){ //if currency code of country list is equal to option value
            let imgTag = element.parentElement.querySelector("img"); // Selecting img tag of particular drop list
            // Passing country code of a selected currency code in a img url
            imgTag.src = `https://flagsapi.com/${country_code[code]}/flat/64.png`
        }
    }
}

window.addEventListener("load", () =>{
    getExchangeRate();
});

getButton.addEventListener("click", e =>{
    e.preventDefault(); //preventing form from submitting
    getExchangeRate();
});

const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", ()=>{
    let tempCode = fromCurrency.value; // Temporary currency code of FROM drop list
    fromCurrency.value = toCurrency.value; // Passing TO currency code to FROM currency code
    toCurrency.value = tempCode; // Passing temprary currency code to TO currency code
    loadFlag(fromCurrency); // calling loadFlag with passing select element (fromCurrency) ofFROM
    loadFlag(toCurrency); // calling loadFlag with passing select element (toCurrency) of TO
    getExchangeRate();
});

function getExchangeRate(){
    const amount = document.querySelector(".amount input"),
    exchangeRateTxt = document.querySelector(".exchange-rate");
    let amountVal = amount.value;
    // if user don't enter any value or enter 0 then we'll put 1 value by default in the input field
    if(amountVal == "" || amountVal == "0"){
        amount.value = "1";
        amountVal = 1;
    }
    exchangeRateTxt.innerText = "Calculating...";
    let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;
    // fetching api response and returning it with parsing into js obj and in another then method receiving that obj
    fetch(url).then(response => response.json()).then(result => {
        let exchangeRate = result.conversion_rates[toCurrency.value];
        let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
        // if user is offline or other error occured while fecting data then catch function will run
    }).catch(() =>{
        exchangeRateTxt.innerText = "Error";
    })
}
