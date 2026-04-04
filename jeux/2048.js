const gridDisplay = document.querySelector('.grid');
const tileContainer = document.getElementById('tile-container');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('best-score');
const gameOverOverlay = document.getElementById('game-over');
const gameWonOverlay = document.getElementById('game-won');
const restartBtns = document.querySelectorAll('#restart-btn, .restart-btn-over');
const keepPlayingBtn = document.querySelector('.keep-playing-btn');

let board = [];
let score = 0;
let bestScore = localStorage.getItem('2048-best-score') || 0;
bestScoreDisplay.textContent = bestScore;
let hasWon = false;
let keepPlaying = false;
const size = 4;
let touchStartX = 0;
let touchStartY = 0;

function initGame() {
    board = Array(size).fill().map(() => Array(size).fill(0));
    score = 0;
    hasWon = false;
    keepPlaying = false;
    updateScore();
    tileContainer.innerHTML = '';
    gameOverOverlay.classList.add('hidden');
    gameWonOverlay.classList.add('hidden');
    
    addRandomTile();
    addRandomTile();
    renderBoard();
}

function addRandomTile() {
    let emptyCells = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (board[r][c] === 0) {
                emptyCells.push({r, c});
            }
        }
    }
    if (emptyCells.length > 0) {
        let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
    }
}

function renderBoard() {
    tileContainer.innerHTML = '';
    
    // Compute tile size based on container width
    const boardWidth = document.getElementById('game-board').clientWidth - 20; // 10px padding * 2
    const gap = 10;
    const tileSize = (boardWidth - (gap * (size - 1))) / size;

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (board[r][c] !== 0) {
                let val = board[r][c];
                let tile = document.createElement('div');
                tile.classList.add('tile', val > 2048 ? 'tile-super' : `tile-${val}`);
                
                // Position logic
                tile.style.width = `${tileSize}px`;
                tile.style.height = `${tileSize}px`;
                tile.style.transform = `translate(${c * (tileSize + gap)}px, ${r * (tileSize + gap)}px)`;
                
                let tileInner = document.createElement('div');
                tileInner.classList.add('tile-inner');
                tileInner.textContent = val;
                
                tile.appendChild(tileInner);
                tileContainer.appendChild(tile);
            }
        }
    }
}

let moved = false;

function moveLeft() {
    for (let r = 0; r < size; r++) {
        let row = board[r].filter(val => val !== 0);
        for (let i = 0; i < row.length - 1; i++) {
            if (row[i] === row[i+1]) {
                row[i] *= 2;
                score += row[i];
                row.splice(i + 1, 1);
            }
        }
        while (row.length < size) {
            row.push(0);
        }
        if (board[r].join(',') !== row.join(',')) moved = true;
        board[r] = row;
    }
}

function moveRight() {
    for (let r = 0; r < size; r++) {
        let row = board[r].filter(val => val !== 0);
        for (let i = row.length - 1; i > 0; i--) {
            if (row[i] === row[i-1]) {
                row[i] *= 2;
                score += row[i];
                row.splice(i - 1, 1);
                i--; // Adjust index
            }
        }
        while (row.length < size) {
            row.unshift(0); 
        }
        if (board[r].join(',') !== row.join(',')) moved = true;
        board[r] = row;
    }
}

function moveUp() {
    for (let c = 0; c < size; c++) {
        let col = [];
        for (let r = 0; r < size; r++) if (board[r][c] !== 0) col.push(board[r][c]);
        
        for (let i = 0; i < col.length - 1; i++) {
            if (col[i] === col[i+1]) {
                col[i] *= 2;
                score += col[i];
                col.splice(i + 1, 1);
            }
        }
        while (col.length < size) col.push(0);
        
        for (let r = 0; r < size; r++) {
            if (board[r][c] !== col[r]) moved = true;
            board[r][c] = col[r];
        }
    }
}

function moveDown() {
    for (let c = 0; c < size; c++) {
        let col = [];
        for (let r = 0; r < size; r++) if (board[r][c] !== 0) col.push(board[r][c]);
        
        for (let i = col.length - 1; i > 0; i--) {
            if (col[i] === col[i-1]) {
                col[i] *= 2;
                score += col[i];
                col.splice(i - 1, 1);
                i--;
            }
        }
        while (col.length < size) col.unshift(0);
        
        for (let r = 0; r < size; r++) {
            if (board[r][c] !== col[r]) moved = true;
            board[r][c] = col[r];
        }
    }
}

function checkWinOrLose() {
    updateScore();
    if (!hasWon && !keepPlaying) {
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (board[r][c] === 2048) {
                    hasWon = true;
                    setTimeout(() => gameWonOverlay.classList.remove('hidden'), 300);
                    return;
                }
            }
        }
    }

    let isFull = true;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (board[r][c] === 0) isFull = false;
        }
    }
    if (isFull) {
        let possibleMove = false;
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (c < size-1 && board[r][c] === board[r][c+1]) possibleMove = true;
                if (r < size-1 && board[r][c] === board[r+1][c]) possibleMove = true;
            }
        }
        if (!possibleMove) {
            setTimeout(() => gameOverOverlay.classList.remove('hidden'), 300);
        }
    }
}

function updateScore() {
    scoreDisplay.textContent = score;
    if (score > bestScore) {
        bestScore = score;
        bestScoreDisplay.textContent = bestScore;
        localStorage.setItem('2048-best-score', bestScore);
    }
}

function handleInput(direction) {
    moved = false;
    if (direction === 'ArrowLeft') moveLeft();
    else if (direction === 'ArrowRight') moveRight();
    else if (direction === 'ArrowUp') moveUp();
    else if (direction === 'ArrowDown') moveDown();

    if (moved) {
        addRandomTile();
        renderBoard();
        checkWinOrLose();
    }
}

document.addEventListener('keydown', (e) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault(); 
        if (!gameOverOverlay.classList.contains('hidden') || (!gameWonOverlay.classList.contains('hidden') && !keepPlaying)) return;
        handleInput(e.key);
    }
});

let gameBoard = document.getElementById('game-board');

gameBoard.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, {passive: false});

gameBoard.addEventListener('touchend', e => {
    if (!gameOverOverlay.classList.contains('hidden') || (!gameWonOverlay.classList.contains('hidden') && !keepPlaying)) return;
    
    let touchEndX = e.changedTouches[0].screenX;
    let touchEndY = e.changedTouches[0].screenY;
    
    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > 30) {
            handleInput(dx > 0 ? 'ArrowRight' : 'ArrowLeft');
        }
    } else {
        if (Math.abs(dy) > 30) {
            handleInput(dy > 0 ? 'ArrowDown' : 'ArrowUp');
        }
    }
});

gameBoard.addEventListener('touchmove', e => {
    e.preventDefault();
}, {passive: false});

window.addEventListener('resize', renderBoard);

restartBtns.forEach(btn => btn.addEventListener('click', initGame));

keepPlayingBtn.addEventListener('click', () => {
    keepPlaying = true;
    gameWonOverlay.classList.add('hidden');
});

initGame();
