function updateGeneratorOptions() {
    // Fetch updated options from the server
    fetch('/getOptions')
        .then(response => response.json())
        .then(options => {
            // Update options for generator
            updateGenerator(options);
        })
        .catch(error => console.error('Error fetching options:', error));
}

// Add a new function to update generator options
function updateGenerator(options) {
    // Update options for generator
    mealOptions = options.meals;
    dessertOptions = options.desserts;
    activityOptions = options.activities;
    endingOptions = options.endofnight;
}


var selectedRow = null;
function onFormSubmit() {
    event.preventDefault();
    var formData = readFormData();
    if(selectedRow === null) {
        insertNewRecord(formData);
    }
    else {
        updateRecord(formData);
    }
    resetForm();
}

//Retrieve the data
function readFormData() {
    var formData = {};
    formData["meals"] = document.getElementById("meals").ariaValueText;
    formData["desserts"] = document.getElementById("desserts").ariaValueText;
    formData["activities"] = document.getElementById("activities").ariaValueText;
    formData["endofnight"] = document.getElementById("endofnight").ariaValueText;
    return formData;
}

//Insert the Data
function insertNewData(data) {
    var table = document.getElementById("storeList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    var cell1 = newRow.insertCell(0);
        cell1.innerHTML = data.meals;
    var cell2 = newRow.insertCell(1);
        cell2.innerHTML = data.desserts;
    var cell3 = newRow.insertCell(2);
        cell3.innerHTML = data.activities;
    var cell4 = newRow.insertCell(3);
        cell4.innerHTML = data.endofnight;
    var cell5 = newRow.insertCell(4);
        cell5.innerHTML = "<button onClick='onEdit(this)'>Edit</button> <button onClick='onDelete(this)'>Delete</button>"
    
    updateGeneratorOptions();
}

//Edit the Data
function onEdit(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById('meals').value = selectedRow.cells[0].innerHTML;
    document.getElementById('desserts').value = selectedRow.cells[1].innerHTML;
    document.getElementById('activities').value = selectedRow.cells[2].innerHTML;
    document.getElementById('endofnight').value = selectedRow.cells[3].innerHTML;
}

function updateRecord(formData) {
    selectedRow.cells[0].innerHTML = formData.meals;
    selectedRow.cells[1].innerHTML = formData.desserts;
    selectedRow.cells[2].innerHTML = formData.activities;
    selectedRow.cells[3].innerHTML = formData.endofnight;
}

//Delete the Data
function onDelete(td) {
    if(confirm('Do you wish to delete this?')) {
        row = td.parentElement.parentElement;
        document.getElementById('storeList').deleteRow(row.rowIndex);
    }
    resetForm();
}

//Reset the Data
function resetForm() {
    document.getElementById('meals').value = '';
    document.getElementById('desserts').value = '';
    document.getElementById('activities').value = '';
    document.getElementById('endofnight').value = '';
}