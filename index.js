// Input boxes
const colorInputEl = document.getElementById("color_input")
const contentInputEl = document.getElementById("content_input")

// Load cell information from local storage when the page loads
window.addEventListener("load", () => {
    
    // Retrieve the stored input values from localStorage
    const storedInputValues = localStorage.getItem("inputValues")

    // Parse the JSON string back into a JavaScript object
    const parsedInputValues = JSON.parse(storedInputValues)

    // Check if there are stored input values
    if (parsedInputValues) {
        // Set the values of the color and content input boxes
        colorInputEl.value = parsedInputValues.colorInput
        contentInputEl.value = parsedInputValues.contentInput
    }
    
    for (let i = 0; i < localStorage.length; i++) {
        
        // Getting the current key
        let key = localStorage.key(i)

        // Check if the key represents a cell (starts with "cell")
        if (key.startsWith("cell")) {
            
            // Retrieve data associated with the key
            let cellData = JSON.parse(localStorage.getItem(key))

            // Update corresponding cell on the page
            let cellEl = document.getElementById(key)
            cellEl.classList = `smallest_unit selected ${cellData.color}`
            cellEl.innerHTML = cellData.content

            // Change font color to black if background is yellow
            if (cellData.color === "yellow") {
                cellEl.style.color = "black"
            } else {
                cellEl.style.color = "white"
            }
        }
    }
}) // End of "load" event listener

const NUM_CELLS = 21
let cells = []

// Making a list of all the cells
for (let i = 0; i < NUM_CELLS; i++) {
    cells.push(`cell${i + 1}`)
}

// Making the input text is selected when the box is clicked on
function handleInputFocus(inputElement) {
    inputElement.addEventListener("focus", () => {
        inputElement.select()
    })
}

handleInputFocus(colorInputEl)
handleInputFocus(contentInputEl)

// Color list
let colors = ["red", "orange", "yellow", "green", "blue", "purple"]

// Reset Button
const resetButton = document.getElementById("reset")

// When "resetButton" is clicked
resetButton.addEventListener("click", () => {
    for (let i = 0; i < NUM_CELLS; i++) {
        let cellEl = document.getElementById(cells[i])
        cellEl.classList = "smallest_unit far_right"
        cellEl.innerHTML = ""
        
        // Resetting the local storage for each cell
        localStorage.removeItem(cells[i])
    }
})

// Adding an event listener for every cell
for (const cellId of cells) {

    // Getting the ID of the cell
    let cellEl = document.getElementById(cellId)

    // Putting the event listener onto the cell element
    cellEl.addEventListener("click", () => {

        // Getting the value of the color input and handling error cases
        let colorInputElVal = parseInt(colorInputEl.value)
    
        if (isNaN(colorInputElVal) || !Number.isInteger(colorInputElVal) || colorInputElVal < 1 || colorInputElVal > 6) {
            alert("Please enter a number between 1 and 6 for the color input box!")
            colorInputEl.focus()
            return
        }

        // Assigning color
        const color = colors[colorInputElVal - 1]

        // Getting the content from the lower input box
        let content = contentInputEl.value

        // Handling error cases
        if (contentInputEl.value === "") {
            alert("Please enter some content in the lower input box!")
            contentInputEl.focus()
            return
        }
        
        // Setting storage data
        const CELL_DATA = {
            color: color,
            content: content
        }
        
        // Store cell data in local storage
        localStorage.setItem(cellId, JSON.stringify(CELL_DATA))

        if (cellEl.classList == "smallest_unit far_right") {
            cellEl.classList = `smallest_unit selected ${color}`
            cellEl.innerHTML = content

            // Making the text color black if the background color is yellow
            if (color == "yellow") {
                cellEl.style.color = "black"
            } else {
                cellEl.style.color = "white"
            }
        } else {
            // This excecutes if the box is already selected
            cellEl.classList = "smallest_unit far_right"
            cellEl.innerHTML = ""
            
            // Updating local storage - removing the cell's key
            localStorage.removeItem(cellId)
        }
    })
}

/* Button stuff */

// Resetting entire page button
const resetAllBtnEl = document.getElementById("resetEverything")

resetAllBtnEl.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset ALL data on both webpages?")) {
        // Resetting all data
        localStorage.clear()
        colorInputEl.value = ""
        contentInputEl.value = ""
        if (localStorage.length === 0) {
            alert("All data/local storage cleared!")
            location.reload()
        }
    }
})

// Select All Button
const selectAllButton = document.getElementById("selectAll")

// Adding an event listener for the select all button
selectAllButton.addEventListener("click", () => {

    // Getting the value of the color input and handling error cases
    let colorInputElVal = parseInt(colorInputEl.value)
    
    if (isNaN(colorInputElVal) && !Number.isInteger(colorInputElVal)) {
        alert("Please enter numbers only for the color input box (1 - 6)!")
        colorInputEl.value = ""
        colorInputEl.focus()
        return
    } else if (colorInputElVal > 6 || colorInputElVal < 1) {
        alert("Please enter a number between 1 and 6 for the color number!")
        colorInputEl.value = ""
        colorInputEl.focus()
        return
    }

    // Assigning color
    let color = colors[colorInputElVal - 1]

    // Getting the content from the lower input box and handling error cases
    if (contentInputEl.value == "") {
        alert("Please enter some content in the lower input box!")
        contentInputEl.focus()
        return
    }
    
    let content = contentInputEl.value

    // Looping through all the cells and changing each one accordingly
    for (const cell of cells) {
        let cellEl = document.getElementById(cell)
        cellEl.classList = `smallest_unit selected ${color}`

        // Changing font color to white if the color of the selected color is yellow
        if (color == "yellow") {
            cellEl.style.color = "black"
        } else {
            cellEl.style.color = "white"
        }

        // Putting the content inside of the cell
        cellEl.innerHTML = content
        
        // Adding the data to local storage
        let CELL_DATA = {
            color: color,
            content: content
        }
        
        localStorage.setItem(cell, JSON.stringify(CELL_DATA))
    }
})

// Adding event listener for the "toPlayerPage" button
const toPlayerPageBtnEl = document.querySelector("#toPlayerPage")

toPlayerPageBtnEl.addEventListener("click", () => {
    window.location = "players.html"
})

// When a player navigates away from the page
window.addEventListener("beforeunload", () => {
    saveInputValues()
})

function saveInputValues() {
    // Saving the values inside of the input boxes
    let inputValues = {
        colorInput: colorInputEl.value.trim(),
        contentInput: contentInputEl.value.trim()
    }
    localStorage.setItem("inputValues", JSON.stringify(inputValues))
}
