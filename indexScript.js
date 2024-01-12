document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const winnerMessage = document.getElementById("winner-message");
    const restartButton = document.getElementById("restart-btn");
    const playerMessage = document.getElementById("player-message");
    const scoreXElement = document.getElementById("score-x");
    const scoreOElement = document.getElementById("score-o");

    let currentPlayer = "X";
    let gameBoard = ["", "", "", "", "", "", "", "", ""];
    let isDragging = false;
    let scoreX = 0;
    let scoreO = 0;

    // Create cells dynamically
    
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("data-index", i);
        cell.addEventListener("dragover", (e) => e.preventDefault());
        cell.addEventListener("drop", handleDrop);
        grid.appendChild(cell);
    }
    
    function createXElement() {
        const xElement = document.createElement("x-box");
        xElement.textContent = "X";
        xElement.classList.add("drag-item");
        xElement.draggable = true;
        return xElement;

    }
    
    function createOElement() {
        const oElement = document.createElement("o-box");
        oElement.textContent = "O";
        oElement.classList.add("drag-item");
        oElement.draggable = true;
        return oElement;
    }

    const xElements = Array.from({ length: 5 }, createXElement);
    const oElements = Array.from({ length: 5 }, createOElement);

    const xCont = document.querySelector(".x-cont");
    const oCont = document.querySelector(".o-cont");
    xCont.classList.add("draggable-areax");
    oCont.classList.add("draggable-areao");
    xElements.forEach((x) => xCont.appendChild(x));
    oElements.forEach((o) => oCont.appendChild(o));




    const dragItems = document.querySelectorAll(".drag-item");
    dragItems.forEach((item) => {
        item.addEventListener("dragstart", handleDragStart);
        item.addEventListener("dragend", handleDragEnd);
    });

    restartButton.addEventListener("click", restartGame);

    function handleDragStart(e) {
        if (!isDragging && e.target.textContent === currentPlayer) {
            e.dataTransfer.setData("text/plain", e.target.textContent);
            isDragging = true;
        } else {
            e.preventDefault();
        }
    }

    function handleDragEnd() {
        isDragging = false;
    }

    function handleDrop(e) {
        e.preventDefault();
        const index = e.target.getAttribute("data-index");
        const draggedText = e.dataTransfer.getData("text/plain");

        if (isDragging && gameBoard[index] === "" && (draggedText === "X" || draggedText === "O")) {
            gameBoard[index] = draggedText;
            e.target.textContent = draggedText;
            checkWinner();
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            updatePlayerMessage();
            removeDragItem(e.dataTransfer.getData("text/plain"));
        }
    }

    function checkWinner() {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const combo of winningCombos) {
            const [a, b, c] = combo;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                updateScores();
                highlightWinnerCells(combo);
                // RemovehighlightWinnerCells(combo);
                if (scoreX === 3 || scoreO === 3) {
                    displayGameWinMessage(currentPlayer);
                    scoreX = 0;
                    scoreO = 0;
                    scoreXElement.textContent = `Player X Score: ${scoreX}`;
                    scoreOElement.textContent = `Player O Score: ${scoreO}`;
                    setTimeout(() => {
                        restartGame();
                        playerMessage.classList.remove("hidden");
                        playerMessage.textContent = 'First Move Player: X';
                    }, 3000);
                } else {
                    displayWinner(gameBoard[a]);
                    playerMessage.classList.add("hidden");
                }
                return;
            }
            
        }

        if (!gameBoard.includes("")) {
            displayWinner("It's a draw!");
        }
    }

    function highlightWinnerCells(cells) {
        const array = [];
        cells.forEach(index => {
            const cell = document.querySelector(`.cell[data-index="${index}"]`);
            console.log(index);
            cell.classList.add("winner-cell");
            array.push(index);
            
        });
        cells.forEach(index => {
            const cell = document.querySelector(`.cell[data-index="${index}"]`);
            if(array[0] === 0 && array[1] === 4 && array[2] === 8){
                cell.classList.add("winner-cell1");
            }
        });
        cells.forEach(index => {
            const cell = document.querySelector(`.cell[data-index="${index}"]`);
            if(array[0] === 2 && array[1] === 4 && array[2] === 6){
                cell.classList.add("winner-cell2");
            }
        });
        cells.forEach(index => {
            const cell = document.querySelector(`.cell[data-index="${index}"]`);
            if(array[0] === 0 && array[1] === 3 && array[2] === 6 || array[0] === 1 && array[1] === 4 && array[2] === 7 || array[0] === 2 && array[1] === 5 && array[2] === 8) {
                cell.classList.add("winner-cell3");
            }
        });
        cells.forEach(index => {
            const cell = document.querySelector(`.cell[data-index="${index}"]`);
            if(array[0] === 0 && array[1] === 1 && array[2] === 2 || array[0] === 3 && array[1] === 4 && array[2] === 5 || array[0] === 6 && array[1] === 7 && array[2] === 8) {
                cell.classList.add("winner-cell4");
            }
        });
    }

    function displayWinner(winner) {
        if(winner === ("It's a draw!")){
            winnerMessage.textContent = `It's a draw!`;
        }else{
            winnerMessage.textContent = `Player ${winner} wins!`;
        }
       
        winnerMessage.classList.remove("hidden");
        disableCells();
    }

    function disableCells() {
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell) => cell.removeEventListener("drop", handleDrop));
    }


    
    function updateScores() {
        if (currentPlayer === "X") {
            scoreX++;
            scoreXElement.textContent = `Player X Score: ${scoreX}`;
        } else {
            scoreO++;
            scoreOElement.textContent = `Player O Score: ${scoreO}`;
        }
    }

    function restartGame() {
        gameBoard = ["", "", "", "", "", "", "", "", ""];
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell) => {
            cell.classList.remove("winner-cell1");
            cell.classList.remove("winner-cell2");
            cell.classList.remove("winner-cell3");
            cell.classList.remove("winner-cell4");
            cell.textContent = "";
            cell.addEventListener("drop", handleDrop);
        });
        winnerMessage.classList.add("hidden");
        currentPlayer = "X";
        resetDragItems();
        playerMessage.classList.remove("hidden");
        playerMessage.textContent = 'First Move Player: X';
        
    }

    function updatePlayerMessage() {
        playerMessage.textContent = `Next Move: Player ${currentPlayer}`;

    }
    function displayGameWinMessage(winner) {
        const backdrop = document.createElement("div");
    backdrop.classList.add("backdrop");
    document.body.appendChild(backdrop);

    const gameWinMessage = document.createElement("div");
    gameWinMessage.classList.add("game-win-message");
    gameWinMessage.textContent = `Player ${winner} Wins the Game!`;
    document.body.appendChild(gameWinMessage);

    setTimeout(() => {
        backdrop.remove();
        gameWinMessage.remove();
        restartGame();
    }, 3000);
    }

    

    function removeDragItem(itemText) {
        const draggableAreax = document.querySelector(".draggable-areax");
        const draggableAreao = document.querySelector(".draggable-areao");
        const dragItemsx = Array.from(draggableAreax.querySelectorAll(".drag-item"));
        const dragItemso = Array.from(draggableAreao.querySelectorAll(".drag-item"));
        const dragItemToRemovex = Array.from(dragItemsx).find((item) => item.textContent === itemText);
        const dragItemToRemoveo = Array.from(dragItemso).find((item) => item.textContent === itemText);
        if (dragItemToRemovex) {
            dragItemToRemovex.remove();
            
            
        }else if(dragItemToRemoveo){
            dragItemToRemoveo.remove();
        }
    }

    function resetDragItems() {
        const draggableAreax = document.querySelector(".draggable-areax");
        const draggableAreao = document.querySelector(".draggable-areao");
        draggableAreax.innerHTML = "";
        draggableAreao.innerHTML = "";
        xElements.forEach((x) => draggableAreax.appendChild(x));
        oElements.forEach((o) => draggableAreao.appendChild(o));
    }
});
