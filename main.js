  // ===== Game Board =====
  const GameBoard = (() => {
    let board = Array(9).fill("");

    const getBoard = () => board;

    const resetBoard = () => { board = Array(9).fill("") };
    
    const setCell = (index, marker) => {
      if (board[index] === "") {
        board[index] = marker;
        return true;
      }
      return false;
    };

    return { getBoard, resetBoard, setCell };
  })();


  // ===== Create Player Factory =====
  function createPlayer(name, marker) { 
    return { name, marker, score: 0 } 
  };


  // ===== Game Controller =====
  const GameController = (() => {
    const playerOne = createPlayer("Player X", "X");
    const playerTwo = createPlayer("Player O", "O");
    let currentPlayer = playerOne;
    let roundOver = false;

    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],  // horizontal
      [0, 3, 6], [1, 4, 7], [2, 5, 8],  // vertical
      [0, 4, 8], [2, 4, 6],             // diagonal
    ];


    const playTurn = (index) => {
      if(roundOver) return;
      if (!GameBoard.setCell(index, currentPlayer.marker)) return;  // Check if the play is valid.

      if(checkWin(currentPlayer.marker)) {
        currentPlayer.score++;
        roundOver = true;
        
        return;
      } else if(checkTie()) {
        roundOver = true;
        return;
      } else {
        switchPlayer();
      };
    };

    const getWinningCombo = (marker) => {
      return winningCombinations.find(combination => 
        combination.every(index => GameBoard.getBoard()[index] === marker)
      ) || null;
    };

    const checkWin = (marker) => {
      return winningCombinations.some(combination => 
        combination.every(index => GameBoard.getBoard()[index] === marker) // Evaluates whether all indexes in that combination have the same marker.
      );
    };

    const checkTie = () => {
      return GameBoard.getBoard().every(cell => cell !== "");
    };

    const switchPlayer = () => {
      currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
    };

    const restart = () => {
      GameBoard.resetBoard();
      currentPlayer = playerOne;
      roundOver = false;
    };

    const resetMatch = () => {
      playerOne.score = 0;
      playerTwo.score = 0;
      restart();
    }

    const isRoundOver =  () => roundOver;
    const isMatchOver =  () => playerOne.score === 3 || playerTwo.score === 3;
    const getCurrentPlayer = () => currentPlayer;
    const getPlayers = () => ({ playerOne, playerTwo })

    return { playTurn, restart, resetMatch, getCurrentPlayer, getPlayers, isRoundOver, isMatchOver, getWinningCombo };
  })();


  // ===== Display Controller =====
  const DisplayController = (() => {
    const { playerOne, playerTwo } = GameController.getPlayers();

    const formSection =  document.querySelector(".form-section");
    const gameboardSection =  document.querySelector(".gameboard-section");

    const playerOneInput = document.getElementById("playerOneName");
    const playerTwoInput = document.getElementById("playerTwoName");

    const xScoreEl = document.getElementById("playerOneScore");
    const xLabelEl = document.getElementById("playerOneLabel");
    const oScoreEl = document.getElementById("playerTwoScore");
    const oLabelEl = document.getElementById("playerTwoLabel");

    const cells = document.querySelectorAll(".cell");

    const homeBtn = document.getElementById("home");
    const startBtn = document.getElementById("start");
    const restartBtn = document.getElementById("restart");

    startBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showNames();
      renderBoard();

      formSection.style.display = "none";
      gameboardSection.style.display = "flex";
      homeBtn.style.visibility = "visible";
      restartBtn.style.visibility = "hidden";
    })

    restartBtn.addEventListener("click", () => {
      restartBtn.style.visibility = "hidden";
      GameController.resetMatch();
      renderScore();
      clearBoard();
    });

    homeBtn.addEventListener("click", () => {
      homeBtn.style.visibility = "hidden"
      formSection.style.display = "flex";
      gameboardSection.style.display = "none";
      GameController.resetMatch();
      clearBoard();
      resetUI();
    });

    cells.forEach(cell => {
      cell.addEventListener("click", () => {
        GameController.getCurrentPlayer().marker === "X" ? cell.classList.add("x-mark") : cell.classList.add("o-mark");
        GameController.playTurn(cell.dataset.index);
        renderBoard();

        // Effects to improve user experience.
        if (GameController.isRoundOver()) {
          renderScore();
          darkenMarks();
          const winningCombo = GameController.getWinningCombo(GameController.getCurrentPlayer().marker);
          if (winningCombo) highlightWinningCells(winningCombo);
          if (GameController.isMatchOver()) {
            highlightWinnerName(GameController.getCurrentPlayer());
            restartBtn.style.visibility = "visible";
            return;
          }
          setTimeout(() => clearBoard(), 2000);
        }
      })
    })

    const highlightWinnerName = (winner) => {
      if (winner.marker = "X") {
        xScoreEl.classList.add("win");
        xLabelEl.classList.add("win");
      } else {
        oScoreEl.classList.add("win");
        oLabelEl.classList.add("win");
      }
    }

    const highlightWinningCells = (combo) => {
      combo.forEach(index => {
        const cell = document.querySelector(`[data-index='${index}']`);
        cell.classList.remove("black");
        cell.classList.add('win');
      });
    };

    const removeHighlightWinner = () => {
        xScoreEl.classList.remove("win");
        xLabelEl.classList.remove("win");
        oScoreEl.classList.remove("win");
        oLabelEl.classList.remove("win");
    }

    const darkenMarks = () => {
      cells.forEach(cell => cell.classList.add("black"));
    }

    const clearBoard = () => {
      cells.forEach(cell => cell.classList.remove("x-mark", "o-mark", "win", "black"));
      removeHighlightWinner();
      GameController.restart();
      renderBoard();
    }

    const resetUI = () => {
      playerOneInput.value = "";
      xScoreEl.textContent = "0";
      playerTwoInput.value = "";
      oScoreEl.textContent = "0";
    }

    const showNames = () => {
      xLabelEl.textContent = playerOneInput.value.trim() || "Player X";
      oLabelEl.textContent = playerTwoInput.value.trim() || "Player O";
    }

    const renderScore = () => {
      xScoreEl.textContent = playerOne.score;
      oScoreEl.textContent = playerTwo.score;
    }

    const renderBoard = () => {
      cells.forEach((cell, index) => {
        cell.textContent = GameBoard.getBoard()[index];
      })
    }
  })();