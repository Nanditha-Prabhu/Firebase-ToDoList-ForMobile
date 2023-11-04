import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://project1-370017-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const toDoListInDB = ref(database, "toDoList")

const inputfld = document.getElementById("input-field")
const addBtn = document.getElementById("add-btn")
const listItem = document.getElementById("to-do-list")

// fn to clear input field after clicking btn
function clearInputField() {
    inputfld.value = ""
}

// to clear list before displaying new list
function clearList() {
    listItem.innerHTML = ""
}

// display items taken as input
function renderEle(input) {
    // listItem.innerHTML += `<li>${inputVal}</li>`

    let itemID = input[0]
    let itemval = input[1]
    let newEl = document.createElement("li")
    newEl.textContent = itemval

    // deleting items
    newEl.addEventListener('dblclick', function() {
        let exactLocationOfItem = ref(database, `toDoList/${itemID}`)
        remove(exactLocationOfItem)
    })
    listItem.append(newEl)
}

// adding items to the database
addBtn.addEventListener("click", function() {
    const inputVal = inputfld.value 
    if (inputVal != "") {
        push(toDoListInDB, inputVal)
    }
    clearInputField()
})

//if there are direct changes from the database, updation
onValue(toDoListInDB, function(changes) {
    if(changes.exists() == true){
        let itemsArray = Object.entries(changes.val())
        clearList()
        for(let i=0; i<itemsArray.length; i++) {
            let item = itemsArray[i]
            let itemID = item[0]
            let itemval = item[1]
            renderEle(item)
        }
    }
    else{
        listItem.innerHTML += `<p>No items here yet</p>`
    }
})