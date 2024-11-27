const currentGame = {
  rowCount: 3,
  columnCount: 3,
  lights: [true, true, true, true, true, true, true, true, true],
  startTime: new Date(),
};

// Returns true if all lights in the game grid are off, false otherwise.
function allLightsOut(game) {
  for (let i = 0; i < game.lights.length; i++) {
    // Even one light being on implies that not all are out/off
    if (game.lights[i]) {
      return false;
    }
  }
  return true;
}

// Toggles the light at (row, column) and each orthogonally adjacent light
function toggle(game, row, column) {
  const locations = [
    [row, column],
    [row - 1, column],
    [row + 1, column],
    [row, column - 1],
    [row, column + 1],
  ];
  for (let location of locations) {
    row = location[0];
    column = location[1];
    if (
      row >= 0 &&
      row < game.rowCount &&
      column >= 0 &&
      column < game.columnCount
    ) {
      // Compute array index
      const index = row * game.columnCount + column;

      // Toggle the light
      game.lights[index] = !game.lights[index];
    }
  }
}

// Add an event listener for the DOMContentLoaded event
window.addEventListener("DOMContentLoaded", domLoaded);

function checkForWin(game) {
  if (allLightsOut(game)) {
    // Compute the time taken to solve the puzzle
    const now = new Date();
    const timeTaken = Math.floor((now - game.startTime) / 1000);

    // Display message
    const infoDIV = document.getElementById("information");
    infoDIV.innerHTML = "You win! Solved in " + timeTaken + " seconds";

    return true; // game is won
  }

  return false; // game is not won
}

// Handles a click at the specified location. Toggles lights, updates
// the HTML grid on the page, and checks to see if the game is won.
function clickLight(game, row, column) {
  // Ignore if the game is already won
  if (allLightsOut(game)) {
    return;
  }

  // Toggle the appropriate lights
  toggle(game, row, column);

  // Update the HTML grid
  updateGridButtons(game);

  // Check to see if the game is won
  checkForWin(game);
}

// Creates the grid of buttons that represents the lights and clears the
// information <div>
function createGameBoard(game, is5x5) {
  // Get the grid <div> and clear existing content
  const gameGrid = document.getElementById("gameGrid");
  gameGrid.innerHTML = "";

  // Set the layout style based on game size
  gameGrid.className = is5x5 ? "grid5x5" : "grid3x3";

  // Create the grid of buttons
  for (let row = 0; row < game.rowCount; row++) {
    for (let column = 0; column < game.columnCount; column++) {
      // Create the button and append as a child to gameGrid
      const button = document.createElement("input");
      button.type = "button";
      gameGrid.appendChild(button);

      // Set the button's click event handler
      button.addEventListener("click", (e) => {
        clickLight(game, row, column);
      });
    }
  }

  // Update button styles from game.lights array
  updateGridButtons(game);

  // Clear the information <div>
  const infoDIV = document.getElementById("information");
  infoDIV.innerHTML = "";
}

// Called when the page's DOM content loads. Adds click event listeners and
// starts a new 3x3 game.
function domLoaded() {
  // Add click event listeners for the two new game buttons
  const btn3x3 = document.getElementById("newGame3x3Button");
  btn3x3.addEventListener("click", function () {
    newGame(currentGame, false);
  });
  const btn5x5 = document.getElementById("newGame5x5Button");
  btn5x5.addEventListener("click", function () {
    newGame(currentGame, true);
  });

  // Start a new 3x3 game
  newGame(currentGame, false);
}

// Resets to a random, winnable game with at least 1 light on
function newGame(game, is5x5) {
  // Set the number of rows and columns
  if (is5x5) {
    game.rowCount = 5;
    game.columnCount = 5;
  } else {
    game.rowCount = 3;
    game.columnCount = 3;
  }

  // Allocate the light array, with all lights off
  const lightCount = game.rowCount * game.columnCount;
  game.lights = [];
  for (let i = 0; i < lightCount; i++) {
    game.lights.push(false);
  }

  // Perform a series of random toggles, which generates a game grid
  // that is guaranteed to be winnable
  while (allLightsOut(game)) {
    // Generate random lights
    for (let i = 0; i < 20; i++) {
      const randRow = Math.floor(Math.random() * game.rowCount);
      const randCol = Math.floor(Math.random() * game.columnCount);

      // Toggle at the location
      toggle(game, randRow, randCol);
    }
  }

  // Create the UI
  createGameBoard(game, is5x5);

  // Store the start time
  game.startTime = new Date();
}

// Updates the HTML grid's buttons based on game.lights
function updateGridButtons(game) {
  // Get the game grid <div>
  const gameGrid = document.getElementById("gameGrid");

  // Update grid buttons based on the game's light array entries
  for (let i = 0; i < game.lights.length; i++) {
    // Update the button's style based on the light state
    const button = gameGrid.children[i];
    button.className = game.lights[i] ? "lightOn" : "lightOff";
  }
}
