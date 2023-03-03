console.clear();

let started = false;
let gameOver = false;
let difficulty = 'normal';

let sec = 0;
let sec1 = 0;
let sec2 = 0;
let sec3 = 0;
let timerId;
let timerId1;
let timerId2;
let timerId3;

let mines = 40;
let size = 16;
const tileSize = 17;

let tiles;
let boardSize;
let minesStr;

const board = document.querySelector('.board');
const boardWrapper = document.querySelector('.board-wrap');
const restartBtn = document.querySelector('.minesweeper-btn');
const difficultyBtnsWrapper = document.querySelector('.fieldset');
const difficultyBtnsLabel = difficultyBtnsWrapper.querySelectorAll('label');

const border = document.querySelectorAll('.wrapper-border-vert');

const timer_num_1 = document.getElementById("timer-num-1");
const timer_num_2 = document.getElementById("timer-num-2");
const timer_num_3 = document.getElementById("timer-num-3");

const bombs_num_1 = document.getElementById("bombs-num-1");
const bombs_num_2 = document.getElementById("bombs-num-2");
const bombs_num_3 = document.getElementById("bombs-num-3");

let bombs = [];
let numbers = [];

const numberIcons = [
    '0 17px',
    '-17px 17px',
    '-34px 17px',
    '-51px 17px',
    '-67px 17px',
    '54px 17px',
    '38px 17px',
    '20px 17px',
];

const timerNumbers = {
    '0': '13px 0',
    '1': '0 0',
    '2': '-14px 0',
    '3': '-28px 0',
    '4': '-42px 0',
    '5': '-56px 0',
    '6': '69px 0',
    '7': '55px 0',
    '8': '41px 0',
    '9': '27px 0',
}

const changeMinesCouter = () => {
    mines >= 100 ? minesStr = String(mines) : mines >= 10 ? minesStr = "0" + mines : minesStr = "00" + mines;
    bombs_num_1.style.backgroundPosition =  timerNumbers[`${minesStr[0]}`];
    bombs_num_2.style.backgroundPosition = timerNumbers[`${minesStr[1]}`];
    bombs_num_3.style.backgroundPosition = timerNumbers[`${minesStr[2]}`];
}

const clear = () => {
	gameOver = false;
    started = false;
	bombs = [];
	numbers = [];
    sec = 0;
    
    sec1 = 0;
    sec2 = 0;
    sec3 = 0;

	tiles.forEach(tile => {
		tile.remove();
	});

    clearInterval(timerId);
    clearInterval(timerId1);
    clearInterval(timerId2);
    clearInterval(timerId3);
	
	printBoard();
}

const printBoard = () => {
    changeMinesCouter();


    timer_num_1.style.backgroundPosition = timerNumbers[`0`];
    timer_num_2.style.backgroundPosition = timerNumbers[`0`];
    timer_num_3.style.backgroundPosition = timerNumbers[`0`];

	for (let i = 0; i < Math.pow(size, 2); i++) {
		const tile = document.createElement('div');
		tile.classList.add('tile');
		board.appendChild(tile);
	}

	tiles = document.querySelectorAll('.tile');
	boardSize = Math.sqrt(tiles.length);

    board.style.width = boardSize * tileSize + 'px';
    board.style.height = boardSize * tileSize + 'px';
    boardWrapper.style.height = boardSize * tileSize + 'px';
    
    border.forEach((e) => {
        e.style.height = `${e.parentElement.clientHeight}px`;
    });

	document.documentElement.style.setProperty('--tileSize', `${tileSize}px`);
	document.documentElement.style.setProperty('--boardSize', `${boardSize * tileSize}px`);
}

const start = (e) => {
    timerId = setInterval(tick, 1000);
    timerId1 = setInterval(tick1, 1000);
    timerId2 = setInterval(tick2, 10000);
    timerId3 = setInterval(tick3, 100000);
	
	let x = 0;
	let y = 0;
	tiles.forEach((tile) => {
		tile.setAttribute('data-tile', `${x},${y}`);

		x++;
		if (x >= boardSize) {
			x = 0;
			y++;
		}
	});

    for (let i = 0; i < mines;) {
        const x = randomInteger(0, size - 1);
        const y = randomInteger(0, size - 1);

        if(bombs.includes(`${x},${y}`) || e.target.getAttribute('data-tile') === `${x},${y}`) continue;

        i += 1;

        bombs.push(`${x},${y}`);

        if (x > 0) numbers.push(`${x-1},${y}`);
        if (x < boardSize - 1) numbers.push(`${x+1},${y}`);
        if (y > 0) numbers.push(`${x},${y-1}`);
        if (y < boardSize - 1) numbers.push(`${x},${y+1}`);
        
        if (x > 0 && y > 0) numbers.push(`${x-1},${y-1}`);
        if (x < boardSize - 1 && y < boardSize - 1) numbers.push(`${x+1},${y+1}`);
        
        if (y > 0 && x < boardSize - 1) numbers.push(`${x+1},${y-1}`);
        if (x > 0 && y < boardSize - 1) numbers.push(`${x-1},${y+1}`);
    }

	numbers.forEach(num => {
		let coords = num.split(',');
		let tile = document.querySelector(`[data-tile="${parseInt(coords[0])},${parseInt(coords[1])}"]`);

        let dataNum = parseInt(tile.getAttribute('data-num'));
		
		if (!dataNum) dataNum = 0;
		tile.setAttribute('data-num', dataNum + 1);
	});
}
const flag = (tile) => {
	if (gameOver) return;
	if (!tile.classList.contains('tile--checked')) {
		if (!tile.classList.contains('tile--flagged') && !tile.classList.contains('tile--question') && mines !== 0) {
			tile.style.backgroundPosition = '-33px 34px';
			tile.classList.add('tile--flagged');
            --mines;
            changeMinesCouter();
		} else if(tile.classList.contains('tile--flagged')) {
            tile.style.backgroundPosition = '-50px 34px';
            tile.classList.remove('tile--flagged');
            tile.classList.add('tile--question');
            ++mines;
            changeMinesCouter();
        } else {
			tile.style.backgroundPosition = '1px 34px';
			tile.classList.remove('tile--question');
		}
	}
}

const clickTile = (tile) => {
	if (gameOver) return;
	if (tile.classList.contains('tile--checked') || tile.classList.contains('tile--flagged') || tile.classList.contains('tile--question')) return;
	let coordinate = tile.getAttribute('data-tile');
	if (bombs.includes(coordinate)) {
		endGame(tile);
	} else {
		let num = tile.getAttribute('data-num');
		if (num != null) {
			tile.classList.add('tile--checked');
            tile.classList.add(`tile--num${num}`);
			tile.style.backgroundPosition = `${numberIcons[parseInt(num) - 1]}`;
			setTimeout(() => {
				checkVictory();
			}, 100);
			return;
		}
		
		checkTile(coordinate);
	}
	tile.classList.add('tile--checked');
}


const checkTile = (coordinate) => {
	let coords = coordinate.split(',');
	let x = parseInt(coords[0]);
	let y = parseInt(coords[1]);
	
	setTimeout(() => {
		if (x > 0) {
			let targetW = document.querySelector(`[data-tile="${x-1},${y}"`);
			clickTile(targetW, `${x-1},${y}`);
		}
		if (x < boardSize - 1) {
			let targetE = document.querySelector(`[data-tile="${x+1},${y}"`);
			clickTile(targetE, `${x+1},${y}`);
		}
		if (y > 0) {
			let targetN = document.querySelector(`[data-tile="${x},${y-1}"]`);
			clickTile(targetN, `${x},${y-1}`);
		}
		if (y < boardSize - 1) {
			let targetS = document.querySelector(`[data-tile="${x},${y+1}"]`);
			clickTile(targetS, `${x},${y+1}`);
		}
		
		if (x > 0 && y > 0) {
			let targetNW = document.querySelector(`[data-tile="${x-1},${y-1}"`);
			clickTile(targetNW, `${x-1},${y-1}`);
		}
		if (x < boardSize - 1 && y < boardSize - 1) {
			let targetSE = document.querySelector(`[data-tile="${x+1},${y+1}"`);
			clickTile(targetSE, `${x+1},${y+1}`);
		}
		
		if (y > 0 && x < boardSize - 1) {
			let targetNE = document.querySelector(`[data-tile="${x+1},${y-1}"]`);
			clickTile(targetNE, `${x+1},${y-1}`);
		}
		if (x > 0 && y < boardSize - 1) {
			let targetSW = document.querySelector(`[data-tile="${x-1},${y+1}"`);
			clickTile(targetSW, `${x-1},${y+1}`);
		}
	}, 10);
}

const endGame = (clickedTile) => {
    restartBtn.style.backgroundPosition = `32px 60px`;
	gameOver = true;
	tiles.forEach(tile => {
		let coordinate = tile.getAttribute('data-tile');

		if (bombs.includes(coordinate)) {
            if(clickedTile === tile) {
                tile.classList.add('tile--checked', 'tile--bomb');
                tile.style.backgroundPosition = '38px 34px';
            } else if(!tile.classList.contains('tile--flagged') ) {
                tile.classList.add('tile--checked', 'tile--bomb');
                tile.style.backgroundPosition = '54px 34px';
            } else if(tile.classList.contains('tile--flagged')) {
                tile.classList.add('tile--checked', 'tile--bomb');
                tile.style.backgroundPosition = '-34px 34px';
            }
        } else {
            if(tile.classList.contains('tile--flagged')) {
                tile.classList.add('tile--checked');
                tile.style.backgroundPosition = '20px 34px';
            } else if(tile.classList.contains('tile--question')) {
                tile.classList.add('tile--checked');
                tile.style.backgroundPosition = '72px 34px';
            }
        }
	});
}

const checkVictory = () => {
	let win = true;
	tiles.forEach(tile => {
		let coordinate = tile.getAttribute('data-tile');
		if (!tile.classList.contains('tile--checked') && !bombs.includes(coordinate)) win = false;
	});
	if (win) {
        restartBtn.style.backgroundPosition = `58px 60px`;
		gameOver = true;
	}
}

const tick = () => {
    sec++;
    if (sec === 1000) {
        endGame();
    }

    if(gameOver) {
        clearInterval(timerId);
        clearInterval(timerId1);
        clearInterval(timerId2);
        clearInterval(timerId3);
    }
}

const tick1 = () => {
    sec1++;
    if (sec1 === 10) {
        sec1 = 0;
    }

    timer_num_3.style.backgroundPosition = timerNumbers[`${sec1}`];
}

const tick2 = () => {
    sec2++;
    if (sec2 === 10) {
        sec2 = 0;
    }
    timer_num_2.style.backgroundPosition = timerNumbers[`${sec2}`];
}

const  tick3 = () => {
    sec3++;
    if (sec3 === 10) {
        sec3 = 0;
    }

    timer_num_1.style.backgroundPosition = timerNumbers[`${sec3}`];
}

const randomInteger = (min, max) => {
    let rand = min + Math.random() * (max + 1 - min);

    return Math.floor(rand);
}

board.addEventListener("click", (e) => {
    if(e.target.classList.contains("tile") && !started) {
        start(e);
        started = true;
    }

    if(e.target.classList.contains("tile")) {
        clickTile(e.target);
    }
});

board.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    if(e.target.classList.contains("tile")) {
		flag(e.target);
    }
});

board.addEventListener("mousedown", (e) => {
    if(e.target.classList.contains("tile") && !e.target.classList.contains("tile--checked") && !e.target.classList.contains("tile--flagged") && !e.target.classList.contains("tile--question") && !gameOver) {
        restartBtn.style.backgroundPosition = `-54px 60px`;
    }
});

board.addEventListener("mouseup", (e) => {
    if(e.target.classList.contains("tile") && !gameOver) {
        restartBtn.style.backgroundPosition = `0 60px`;
    }
});

restartBtn.addEventListener('click', function(e) {
	e.preventDefault();
	clear();
});

restartBtn.addEventListener('mouseup', function(e) {
	e.preventDefault();
	restartBtn.style.backgroundPosition = `0 60px`;
});

restartBtn.addEventListener('mousedown', function(e) {
	e.preventDefault();
	restartBtn.style.backgroundPosition = `-28px 60px`;
});

difficultyBtnsWrapper.addEventListener('click', function(e) {
    if(e.target.classList.contains('difficulty')) {
        difficulty = e.target.value;
        mines = difficulty === 'normal' ? 40 : difficulty === 'easy' ? 10 : 99;
        size = difficulty === 'normal' ? 16 : difficulty === 'easy' ? 9 : 22;

        clear();
    }
});

printBoard();
