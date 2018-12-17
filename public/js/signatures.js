//Array to store custom signature data after parsing
// TODO: Could modify so this isn't global, but the loading table function takes in
//        a parameter and is called with this on ajax success
var sigObjs = [];

//Initial AJAX call to provided URL to load signature json data
$.ajax({
    url : "https://s3.amazonaws.com/fortios-hiring/test.json",
    type: "GET",
    dataType: "text",
    success: function (data) {
        //Removes leading and trailing semicolon, since our data comes in as not a valid json
        var validJsonString = data.replace(/(^;)|(;$)/g, "");
        var json = JSON.parse(validJsonString);
        for(var i = 0; i < json.length; i++){
            sigObjs.push(createSignatureObj(json[i]));
        }
        loadTableData();
        $(".fixed-table img").hide();
    },
    error: function (jXHR, textStatus, errorThrown) {
        alert("Failed to load table: " + textStatus);
    }
});

//On input keychange, search and display rows who's ID or Name match,
// uses debounce for better performance and no browser hanging.
$("#searchInput").keyup(debounce(function() {
    var data = this.value.toUpperCase();

    var rows = $("#signatures tbody").find("tr");
    if (this.value == "") {
        rows.show();
        return;
    }

    rows.hide();
    rows.filter(function (i, v) {
        var name = v.children[1];
        var id = v.children[0];
        return (name.innerHTML.toUpperCase().indexOf(data) > -1 ||
                  id.innerHTML.toUpperCase().indexOf(data) > -1)
    }).show();
},500));

/**
 * Returns a sorter function that can keep track of ascending and descending, sorts depending on column
 *  reloads the table in apprioriate order and displays, resets search input as whole table is being regenerated.
 * TODO: Change so that we save the current displayed list of searched and sorted signatures so that we can sort on search
 *        on sorted objects without resetting the search.
 **/
var sorter = function sort() {
    var isAscend = true;
    return function(event) {
        if(event.innerHTML == "Date"){
            sigObjs.sort((a,b) =>{ 
                return isAscend ? (new Date(b.date) - new Date(a.date)) : 
                                    (new Date(a.date) - new Date(b.date));
            });
        }
        if(event.innerHTML == "Name"){
            sigObjs.sort((a,b) =>{ 
                return (b.name.toLowerCase() > a.name.toLowerCase()) ? (isAscend ? -1 : 1) :
                                                                        (isAscend ? 1 : -1);
            });
        }
        if(event.innerHTML == "ID"){
            sigObjs.sort((a,b) =>{ 
                return isAscend ? (b.id - a.id) : (a.id - b.id);
            });
        }
        isAscend = !isAscend;

        $("#searchInput").val("");
        loadTableData();
    }
}();

/**
 * Populates table with concise signature information using globally stored signature objects array.
 */
function loadTableData() {
    var tableBody = $("#signatures tbody");

    tableBody.empty();
    for(let i = 0; i < sigObjs.length; i++){
        var tableRow = document.createElement("tr");
        var id = document.createElement("td");
        var name = document.createElement("td");
        var risk = document.createElement("td");
        var date = document.createElement("td");
        
        id.innerHTML = sigObjs[i].id;
        name.innerHTML = sigObjs[i].name;
        risk.innerHTML = sigObjs[i].risk;
        date.innerHTML = sigObjs[i].date;
        
        tableRow.append(id);
        tableRow.append(name);
        tableRow.append(risk);
        tableRow.append(date);
        tableRow.addEventListener("click", displayDetail(sigObjs[i]));

        tableBody.append(tableRow);
    }
}

/**
 * Closure to store elements of the signature description block.
 * Therefore we don't have to re-query each element everytime we change the details.
 * @return function to change details section given a signature object
 **/
var changeDetails = function() {
    var sigName = $("#signatureHeader")[0];
    var sigDetails = $("#signatureDetails tr");
    var sigDescript = $("#signatureDescription")[0];
    var sigReason = $("#signatureReason")[0];
    var sigRef = $("#signatureHref");

    return function(signature) {
        sigName.innerHTML = signature.name;
    
        sigDetails[0].children[1].innerHTML = signature.id;
        sigDetails[1].children[1].innerHTML = signature.company;
        sigDetails[2].children[1].innerHTML = signature.type;
        sigDetails[3].children[1].innerHTML = signature.date;
        sigDetails[4].children[1].innerHTML = signature.url;

        sigDescript.innerHTML = signature.description;
        sigReason.innerHTML = signature.reasonDesc;

        sigRef.empty();
        sigRef.append(signature.ref);

        $("#sigDescription").show();
    }
}();

/**
 * Closure that saves the signature object for a row, is used to bind to onclick for each row
 * @param signature object used for a specific row
 **/
function displayDetail(sigObj) {
    var signature = sigObj;
    return function(){
        changeDetails(signature);
    };
}

/**
 * Creates object from application signature array.
 * This attaches an identifier to each piece of information so it's easier to work with.
 */
function createSignatureObj(sig) {
    return {
        name: sig[0],
        id: sig[14],
        company: sig[6],
        type: sig[1],
        date: sig[5],
        risk: sig[8],
        reasonDesc: sig[9],
        description: sig[11], 
        action: sig[12],
        url: sig[7],
        ref: sig[13],
    };
}

/**
 * Debounce function for better performance.
 * @param function to be debounced
 * @param debounce interval
 **/
function debounce(fn, time) {
  var timeout;

  return function() {
    var functionCall = () => fn.apply(this, arguments);
    
    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
}