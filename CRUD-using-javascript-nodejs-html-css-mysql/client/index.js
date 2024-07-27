document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data =>  loadHTMLTable(data['data']));
})

document.querySelector('table tbody').addEventListener('click', function(event) {
    // console.log(event.target);
    if (event.target.className === "delete-row-btn") {
        deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "edit-row-btn") {
        console.log("DENTRO DE IF ===>>> event.target.dataset.id ===>>>> ", event.target.dataset.id)
        handleEditRow(event.target.dataset.id)
    }
})

const updateBtn = document.querySelector("#update-row-btn");

// Function to delete data
function deleteRowById(id) {
    fetch('http://localhost:5000/delete/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    // After we delete some row, we reload the table. For that, what we realy have to do in a real world application is to create a function that grab the data from database
    // whitout refresh the table like I do here.
    .then(data => {
        if (data.success){
            location.reload();
        }
    });
}

// Function to edit data
function handleEditRow(id) {
    console.log("handleEditRow ==>> id =====>>>>> ", id)
    // when the button is clicked:
    // Show html
    const updateSection = document.querySelector("#update-row");
    updateSection.hidden = false;
    document.querySelector("#update-row-btn").dataset.id = id;
}
updateBtn.onclick = function() {
    const updateNameInput = document.querySelector("#update-name-input");
    console.log("updateNameInput ===>>> ", updateNameInput)
    const getRowId = document.querySelector("#update-row-btn").dataset.id;

    const getAllRow = document.querySelector("#update-row-btn").dataset

    fetch('http://localhost:5000/update', {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            // id: updateNameInput.dataset.id,
            id: getRowId,
            name: updateNameInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    })
}

const addBtn = document.querySelector('#add-name-btn');

addBtn.onclick = function () {
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;

    // We grap the value using "nameInput.value" and every time we sent values to the back-end we are goint to reset "value" to be empty string
    nameInput.value = "";

    // Sending values to our back-end
    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({name : name})
    })
    .then(response => response.json()) // get the Promise and convert it to json
    .then(data => {
        insertRowIntoTable(data['data']); // get the data
        location.reload();
    })

 
}

// Function to insert data into the table
function insertRowIntoTable(data) {
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');
    
    let tableHtml = "<tr>";

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (key === 'dateAdded') {
                data[key] = new Date(data[key]).toLocaleDateString();
            }
            tableHtml += `<td>${data[key]}</td>`
        }
    }
    
    tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</button></td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</button></td>`;

    tableHtml = "</tr>";

    if (isTableData) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}

function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');

    if (data.length === 0) {
        table.innerHTML = "<tr> <td class='no-data' colspan='5'>No Data</td> </tr>";
        return;
    }

    let tableHtml = "";

    data.forEach(function ({id, name, date_added}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleDateString()}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</button></td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</button></td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;

}