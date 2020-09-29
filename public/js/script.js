//Client-side code

function focusOnInput() {
    var phoneNumber = document.getElementById("phoneNumber");
    phoneNumber.select();
}

validateFromCSV = async ()=> {
  const response = await fetch('/validateFromCSV');
  const results = await response.json(); //extract JSON from the http response
  if (results && !results.error) {
    renderTableResults(results);
    var buttonFromCSV = document.getElementById("validateFromCSV");
    buttonFromCSV.disabled = true;
    buttonFromCSV.title = "Results are below";
    window.scroll({
      top: 600,
      behavior: 'smooth'
    });
  } else {
    var resultsDiv = document.getElementById("results");
    if (!resultsDiv.firstChild) {
      var errorP = document.createElement('p');
      errorP.innerHTML = 'Sorry, there was an error, retry';
      errorP.className = 'errorP';
      resultsDiv.appendChild(errorP);
    }
  }
};

function renderTableResults(results) {
  var resultsDiv = document.getElementById("results");
  if (resultsDiv.firstChild) { //if error, remove
    resultsDiv.removeChild(resultsDiv.firstChild);
  }

  createRow = (text1, text2, text3, th) => {
    var cell1 = document.createElement('div');
    cell1.className = "col"+th;
    cell1.innerHTML = text1;
    var cell2 = document.createElement('div');
    cell2.className = "col"+th;
    cell2.innerHTML = text2;
    var cell3 = document.createElement('div');
    cell3.className = "col-6"+th;
    cell3.innerHTML = text3;
    var tr = document.createElement('div');
    tr.className = "row";
    tr.appendChild(cell1);
    tr.appendChild(cell2);
    tr.appendChild(cell3);
    table.appendChild(tr);
  };

  var title = document.createElement('h2');
  title.className = 'tableTitle';
  title.innerHTML = 'Almost correct numbers, with autocorrection on the left';
  resultsDiv.appendChild(title);
  var table = document.createElement('div');
  table.className = "resultsTable";
  createRow('Phone number', 'Result', 'Autocorrected number, "27" has been added', ' th');
  results.correctedNumbers.forEach((el)=>{
  createRow(el.number, el.result, el.correctedNumber, '')});
  resultsDiv.appendChild(table);

  //refactor should be done 
  title = document.createElement('h2');
  title.className = 'tableTitle';
  title.innerHTML = 'Correct numbers';
  resultsDiv.appendChild(title);
  table = document.createElement('div');
  table.className = "resultsTable";
  createRow('Phone number', 'Result', 'Autocorrected number', ' th');
  results.correctNumbers.forEach((el)=>{createRow(el.number, el.result, '-', '')});
  resultsDiv.appendChild(table);

  //refactor should be done 
  title = document.createElement('h2');
  title.className = 'tableTitle';
  title.innerHTML = 'Wrong numbers';
  resultsDiv.appendChild(title);
  table = document.createElement('div');
  table.className = "resultsTable";
  createRow('Phone number', 'Result', 'Cause', ' th');
  results.wrongNumbers.forEach((el)=>{createRow(el.number, el.result, el.cause, '')});
  resultsDiv.appendChild(table);
}