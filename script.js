document.addEventListener('DOMContentLoaded', () => {
    const gridDisplay = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const bestScoreDisplay = document.getElementById('best-score');
    const newGameButton = document.getElementById('new-game');
    const width = 4;
    let squares = [];
    let score = 0;
    let bestScore = parseInt(localStorage.getItem('bestScore')) || 0;

    bestScoreDisplay.innerText = bestScore;

    // Crear el tablero
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.innerHTML = '';
            gridDisplay.appendChild(square);
            squares.push(square);
        }
        generate();
        generate();
    }

    // Generar número aleatorio 
    function generate() {
        const emptySquares = squares.filter(square => !parseInt(square.innerHTML));
        if (emptySquares.length > 0) {
            const randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
            randomSquare.innerHTML = Math.random() < 0.9 ? 2 : 2;
            updateTile(randomSquare);
        }
    }

    // Actualizar las clases para reflejar el valor
    function updateTile(square) {
        const value = parseInt(square.innerHTML) || 0;
        square.className = ''; // Resetear clases
        if (value > 0) square.classList.add(`tile-${value}`);
    }

    // Actualizar todo el tablero
    function updateBoard() {
        squares.forEach(updateTile);
    }

    // Actualizar la puntuación
    function updateScore() {
        scoreDisplay.innerText = score;
        if (score > bestScore) {
            bestScore = score;
            bestScoreDisplay.innerText = bestScore;
            localStorage.setItem('bestScore', bestScore);
        }
    }

    // Función para actualizar el color
    function updateTileColor(square) {
        const value = parseInt(square.innerHTML) || 0;
        // Eliminar todas las clases tile-* existentes
        square.classList.forEach(className => {
            if (className.startsWith('tile-')) {
                square.classList.remove(className);
            }
        });

        // Añadir la clase correspondiente al valor
        if (value > 0) {
            square.classList.add(`tile-${value}`);
        }
    }

	function moveAndCombineLine(line) {
		const filtered = line.filter(num => num); // Filtra los ceros
		const newLine = [];
		let combined = false; // Variable para asegurarse de que no se combinen dos veces
	
		for (let i = 0; i < filtered.length; i++) {
			if (i < filtered.length - 1 && filtered[i] === filtered[i + 1] && !combined) {
				newLine.push(filtered[i] * 2); // Combina los dos números
				score += filtered[i] * 2; // Suma al puntaje
				combined = true; // Marca que ya se ha combinado
				i++; // Salta el siguiente número porque ya fue combinado
			} else {
				newLine.push(filtered[i]);
				combined = false; // Resetea la variable de combinado
			}
		}
	
		// Agrega los ceros al final
		while (newLine.length < width) {
			newLine.push(0);
		}
	
		return newLine;
	}
	
	function getBoardState() {
        return squares.map(square => parseInt(square.innerHTML) || 0);
    }

    function setBoardState(state) {
        for (let i = 0; i < state.length; i++) {
            squares[i].innerHTML = state[i] || '';
        }
        updateBoard();
    }

    function boardsAreEqual(board1, board2) {
        return board1.every((value, index) => value === board2[index]);
    }

    // Movimiento hacia la derecha
    function moveRight() {
        let hasChanged = false;
        for (let i = 0; i < 16; i += 4) {
            const row = [
                parseInt(squares[i].innerHTML) || 0,
                parseInt(squares[i + 1].innerHTML) || 0,
                parseInt(squares[i + 2].innerHTML) || 0,
                parseInt(squares[i + 3].innerHTML) || 0,
            ];
            const newRow = moveAndCombineLine(row.reverse()).reverse();
            for (let j = 0; j < 4; j++) {
                if (squares[i + j].innerHTML != newRow[j]) hasChanged = true;
                squares[i + j].innerHTML = newRow[j] || '';
				updateTileColor(squares[i + j]);
            }
        }
        return hasChanged;
    }

    // Movimiento hacia la izquierda
    function moveLeft() {
        let hasChanged = false;
        for (let i = 0; i < 16; i += 4) {
            const row = [
                parseInt(squares[i].innerHTML) || 0,
                parseInt(squares[i + 1].innerHTML) || 0,
                parseInt(squares[i + 2].innerHTML) || 0,
                parseInt(squares[i + 3].innerHTML) || 0,
            ];
            const newRow = moveAndCombineLine(row);
            for (let j = 0; j < 4; j++) {
                if (squares[i + j].innerHTML != newRow[j]) hasChanged = true;
                squares[i + j].innerHTML = newRow[j] || '';
				updateTileColor(squares[i + j]);
            }
        }
        return hasChanged;
    }

    function moveDown() {
        let hasChanged = false;
        for (let i = 0; i < 4; i++) {
            const column = [
                parseInt(squares[i].innerHTML) || 0,
                parseInt(squares[i + width].innerHTML) || 0,
                parseInt(squares[i + 2 * width].innerHTML) || 0,
                parseInt(squares[i + 3 * width].innerHTML) || 0,
            ];
            const newColumn = moveAndCombineLine(column.reverse()).reverse();
            for (let j = 0; j < 4; j++) {
                if (squares[i + j * width].innerHTML != newColumn[j]) hasChanged = true;
                squares[i + j * width].innerHTML = newColumn[j] || '';
				updateTileColor(squares[i + j * width]);
            }
        }
        return hasChanged;
    }

    function moveUp() {
        let hasChanged = false;
        for (let i = 0; i < 4; i++) {
            const column = [
                parseInt(squares[i].innerHTML) || 0,
                parseInt(squares[i + width].innerHTML) || 0,
                parseInt(squares[i + 2 * width].innerHTML) || 0,
                parseInt(squares[i + 3 * width].innerHTML) || 0,
            ];
            const newColumn = moveAndCombineLine(column);
            for (let j = 0; j < 4; j++) {
                if (squares[i + j * width].innerHTML != newColumn[j]) hasChanged = true;
                squares[i + j * width].innerHTML = newColumn[j] || '';
				updateTileColor(squares[i + j * width]);
            }
        }
        return hasChanged;
    }

    function control(e) {
        const prevState = getBoardState();
        let hasChanged = false;

        switch (e.keyCode) {
            case 37: // Left
                hasChanged = moveLeft();
                break;
            case 38: // Up
                hasChanged = moveUp();
                break;
            case 39: // Right
                hasChanged = moveRight();
                break;
            case 40: // Down
                hasChanged = moveDown();
                break;
        }

        if (hasChanged) {
            generate();
        }

        updateBoard();
        updateScore();

        if (checkWin()) return;
        if (checkLose()) return;
    }

// Detectar deslizamiento táctil
	let startX, startY;
	let threshold = 50;

	function touchStart(e) {
		const touch = e.touches[0];
		startX = touch.pageX;
		startY = touch.pageY;
	}

	function touchEnd(e) {
		const touch = e.changedTouches[0];
		const diffX = touch.pageX - startX;
		const diffY = touch.pageY - startY;

		const prevState = getBoardState();
		let hasChanged = false;

		if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
			// Movimiento horizontal
			if (diffX > 0) {
				hasChanged = moveRight();
			} else {
				hasChanged = moveLeft();
			}
		} else if (Math.abs(diffY) > threshold) {
			// Movimiento vertical
			if (diffY > 0) {
				hasChanged = moveDown();
			} else {
				hasChanged = moveUp();
			}
		}

		if (hasChanged) {
			generate();
		}

		updateBoard();
		updateScore();

		if (checkWin()) return; // Si ha ganado, detener el juego
		if (checkLose()) return;
	}

    // Agregar eventos táctiles
    gridDisplay.addEventListener('touchstart', touchStart);
    gridDisplay.addEventListener('touchend', touchEnd);

    // Reiniciar el juego
    newGameButton.addEventListener('click', () => location.reload());

    document.addEventListener('keydown', control);
    createBoard();
});
