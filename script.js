/*  Project 01_11_02

    Author: Jacob Hobeck
    Date:   8.31.18

    Filename: script.js
*/

"use strict";

// global variables
var httpRequest = false;
var entry = "^IXIC";

// function to retrieve the XMLHttpRequest() object
function getRequestObject() {
    try {
        httpRequest = new XMLHttpRequest();
    } catch {
        return false;
    }
    return httpRequest;
}

// function to stop default submission
function stopSubmission(evt) {
    if (evt.preventDefault) {
        evt.preventDefault();
    } else {
        evt.returnValue = false;
    }
    getQuote();
}

// function to request stock quote data from server
function getQuote() {
    console.log("getQuote")
    if(document.getElementsByTagName("input")[0].value) {
        entry = document.getElementsByTagName("input")[0].value;
    }
    if (!httpRequest) {
        httpRequest = getRequestObject();
    }
    httpRequest.abort();
    httpRequest.open("get", "StockCheck.php?t=" + entry, true);
    httpRequest.send(null);
    httpRequest.onreadystatechange = displayData;
    clearTimeout(updateQuote);
    var updateQuote = setTimeout('getQuote()', 10000);
}

// function to display data
function displayData() {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        var stockResults = httpRequest.responseText;
        var stockItems = stockResults.split(/,|\"/);
        console.log(stockItems);
    }
    for (var i = stockItems.length - 1; i >= 0; i--){
        if (stockItems[i] === "") {
            stockItems.splice(i, 1);
        }
    }
    console.log(stockItems);
    document.getElementById("ticker").innerHTML = stockItems[0];
    document.getElementById("openingPrice").innerHTML = stockItems[6];
    document.getElementById("lastTrade").innerHTML = stockItems[1];
    document.getElementById("lastTradeDT").innerHTML = stockItems[2] + ", " + stockItems[3];
    document.getElementById("change").innerHTML = stockItems[4];
    document.getElementById("range").innerHTML = (stockItems[8] * 1).toFixed(2) + " &ndash; " + (stockItems[7] * 1).toFixed(2);
    document.getElementById("volume").innerHTML = (stockItems[9] * 1).toLocaleString();
}
 
// function to better style the stock data 
function formatTable() {
    var rows = document.getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        rows[i].style.background = "#9FE098";
    }
}
    
// load event listeners
var form = document.getElementsByTagName("form")[0];
if (form.addEventListener) {
    form.addEventListener("submit", stopSubmission, false);
    window.addEventListener("load", formatTable, false);
    window.addEventListener("load", getQuote, false);
} else if (form.attachEvent) {
    form.attachEvent("onsubmit", stopSubmission);
    window.attachEvent("onload", formatTable);
    window.attachEvent("onload", getQuote);
}
