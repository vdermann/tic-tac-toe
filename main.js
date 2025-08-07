const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getGameboard = () => board;

  const setCell = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const resetGameboard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  }

  const printGameboard = () => {
    console.log(`
      ${board[0]} | ${board[1]} | ${board[2]}
      ---------
      ${board[3]} | ${board[4]} | ${board[5]}
      ---------
      ${board[6]} | ${board[7]} | ${board[8]}
    `);
  }

  return { getGameboard, setCell, resetGameboard, printGameboard };
})();



function createPlayer(name, marker) { 
  return { name, marker } 
}



const GameController = (() => {
  const playerOne = createPlayer("Lucas", "X");
  const playerTwo = createPlayer("Marengo", "O");
  let currentPlayer = playerOne;
  let gameOver = false;


  const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
    [0, 4, 8], [2, 4, 6],            // diagonal
  ];


  const playTurn = (index) => {
    if(gameOver) return console.log("Game Over.");

    const success = Gameboard.setCell(index, currentPlayer.marker);
    if(!success) {
      console.log("Esta celda ya está ocupada.");
      return;
    }

    Gameboard.printGameboard();

    if(checkWin(currentPlayer.marker)) {
      console.log(`${currentPlayer.name} (${currentPlayer.marker}) ha ganado!`)
      gameOver = true;
      return;
    }

    if(checkTie()) {
      console.log(`Empate!`)
      gameOver = true;
      return;
    }

    switchPlayer();
  };


  const checkWin = (marker) => {
    return WINNING_COMBINATIONS.some(combination => 
      combination.every(index => Gameboard.getGameboard()[index] === marker) // Evaluates whether all indexes in that combination have the same marker.
    );
  };


  const checkTie = () => {
    return Gameboard.getGameboard().every(cell => cell !== "");
  };


  const switchPlayer = () => {
    currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
  };


  const restart = () => {
    Gameboard.resetGameboard();
    currentPlayer = playerOne;
    gameOver = false;
    Gameboard.printGameboard();
  };


  return { playTurn, restart };
})();