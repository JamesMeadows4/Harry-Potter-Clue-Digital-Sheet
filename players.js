// Load player information from local storage when the page loads
window.addEventListener("load", () => {
    const STORED_PLAYER_INFO = localStorage.getItem("playerInfo");
    if (STORED_PLAYER_INFO) {
        const PLAYER_INFO = JSON.parse(STORED_PLAYER_INFO);
        displayPlayerInfo(PLAYER_INFO);
    }
})

// Managing the button that takes you to the digital sheet page
const toDigitalSheetBtnEl = document.querySelector("#toSheetBtn");

toDigitalSheetBtnEl.addEventListener("click", () => {
    document.location = "index.html";
})

// Fetching all the input elements on the left side
const INPUTS = document.querySelectorAll(".left_side input");

// Handling all input focusing
for (const inputEl of INPUTS) {
    handleInputFocus(inputEl);
}

// INPUTS.forEach(inputEl => handleInputFocus(inputEl));

// Button that when clicked, generates all player and game stats
const generateBtnEl = document.querySelector("#generateGameStatsBtn");

// All of the display boxes
const displayBox = document.querySelector("#displayPlayersList");
const housePointsDisplay = document.querySelector("#housePointsDisplay");
const displayPlayerCards = document.querySelector("#displayPlayerCards");

// When "generateBtnEl" is pressed...
generateBtnEl.addEventListener("click", () => {
    
    /* This stores all of the game characters that a player can be assigned to, shuffled randomly
       Harry, Ron, Hermione, Ginny, Luna, or Neville */
    const GAME_CHARACTERS_ARR = shuffleArray(["Harry", "Ron", "Hermione", "Ginny", "Luna", "Neville"]);
    
    // Getting all of the player names
    let playerNames = getPlayerNames();
    
    // Getting the number of players
    const NUM_PLAYERS = playerNames.length;
    
    // Checking to see if there are enough players
    if (notEnoughPlayers(NUM_PLAYERS)) {
        alert("Not enough players. There should be 3 to 6 players total.");
    
        // Focusing on the upmost input that has no content
        for (const inputEl of INPUTS) {
            if (inputEl.value.trim() === "") {
                inputEl.focus();
                return;
            }
        }
    }
    
    /* Getting the house points for each player
       HP = 10 * numPlayers + 30 */
    const housePointsPerPlayer = getHousePoints(NUM_PLAYERS);

    /* Getting the number of mystery cards per player
       || y = 18 / x || --> y = mystery cards per player, x = number of players */
    const CARDS_PER_PLAYER = Math.trunc(18 / NUM_PLAYERS);
    
    // Getting all of the player assignments
    let assignments = "";
    
    for (let i = 0; i < playerNames.length; i++) {
        assignments += `<li>
                            <strong>${playerNames[i]}</strong>: ${GAME_CHARACTERS_ARR[i]}
                        </li>`;
        if (i == playerNames.length - 1) {
            assignments += "<br>";
        }
    }
    
    // Putting the player information on the screen
    displayBox.innerHTML = assignments;
    
    // Putting the house points per player on the screen
    housePointsDisplay.innerHTML = `<li>${housePointsPerPlayer}</li><br>`;
    
    // Putting the cards per player on the screen
    
    displayPlayerCards.innerHTML = `<li>${CARDS_PER_PLAYER}</li><br>`;
    
    // Saving the player information to local storage
    localStorage.setItem("playerInfo", JSON.stringify({
        playerNames: playerNames,
        gameCharacters: GAME_CHARACTERS_ARR,
        housePointsPerPlayer: housePointsPerPlayer,
        cardsPerPlayer: CARDS_PER_PLAYER
    }));
}) // End of generate player stats button event listener

// Management for clicking the "reset local storage" button
const resetLocalStorageBtnEl = document.querySelector("#resetLocalStorageBtn");

resetLocalStorageBtnEl.addEventListener("dblclick", () => {
    // Next line sets the "playerInfo" to an empty string
    localStorage.setItem("playerInfo", "");
    if (localStorage.getItem("playerInfo")) {
        alert("Clearing local storage task failed! Try again.");
    } else {
        alert("Local storage cleared!");
        clearAllData();
        INPUTS[0].focus();
    }
})

// This function gets all of the player names in the input boxes
function getPlayerNames() {
    const names = [];
    INPUTS.forEach(input => {
        if (input.value.trim() !== "") {
            names.push(input.value.trim());
        }
    });
    return names;
}

// This function clears all of the display areas and input boxes
function clearAllData() {
    displayBox.innerHTML = "";
    housePointsDisplay.innerHTML = "";
    displayPlayerCards.innerHTML = "";
    resetInputs();
}

// This function resets all of the input boxes to being blank
function resetInputs() {
    for (const inputEl of INPUTS) {
        inputEl.value = "";
    }
}

// Function to display player information on the webpage
function displayPlayerInfo(playerInfo) {
    let assignments = "";
    for (let i = 0; i < playerInfo.playerNames.length; i++) {
        assignments += `<li>
                            <strong>${playerInfo.playerNames[i]}</strong>: ${playerInfo.gameCharacters[i]}
                        </li>`;
        if (i == playerInfo.playerNames.length - 1) {
            assignments += "<br>";
        }
    }

    displayBox.innerHTML = assignments;
    housePointsDisplay.innerHTML = `<li>${playerInfo.housePointsPerPlayer}</li><br>`;
    displayPlayerCards.innerHTML = `<li>${playerInfo.cardsPerPlayer}</li><br>`;
    
    // Putting all of the names back into the input boxes
    for (let i = 0; i < playerInfo.playerNames.length; i++) {
        INPUTS[i].value = playerInfo.playerNames[i];
    }
}

// Making the input text is selected when the box is clicked on
function handleInputFocus(inputElement) {
    inputElement.addEventListener("focus", () => {
        inputElement.select();
    })
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/* This function returns the number of house points 
   per player based on how many players are playing */
function getHousePoints(numPlayers) {
    const HP = 10 * numPlayers + 30;
    return HP;
}

/* This function checks if the number of players is less than 3. 
   If true, it returns true, otherwise false. */
function notEnoughPlayers(numPlayers) {
    if (numPlayers < 3) { return true } else { return false }
}
