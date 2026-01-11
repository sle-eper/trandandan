import { Paddle } from './Paddle';
import { PongBall } from './PongBall';
import CountDown from './CountDown';
import '../css/gameCountDown.css';
import { gameSocket } from './services/gameSocket';

console.debug('Game module loaded');

// Game state variables
let c: HTMLCanvasElement;
let ctxt: CanvasRenderingContext2D;
let gameStarted = false;
let awaitingServe = false;
let gameOver = false;
let aiMode = false;
let isRemote = false;
let playerSide: 'left' | 'right' = 'left';
let currentGameId: string | null = null;
let leftScore = 0;
let rightScore = 0;
const winningScore = 5;
let leftPaddle: Paddle;
let rightPaddle: Paddle;
let pongBall: PongBall;
let countdown: CountDown;
let animationId: number | null = null;
let winnerName: string | null = null;

// Define listeners outside to allow proper removal and avoid accumulation
const handleKeyDown = (e: KeyboardEvent) => {
    if (!gameStarted || gameOver) return;

    const myPaddle = playerSide === 'left' ? leftPaddle : rightPaddle;

    if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        e.preventDefault();
        myPaddle.moveUp();
    }
    if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
        e.preventDefault();
        myPaddle.moveDown();
    }
};

const handleKeyUp = (e: KeyboardEvent) => {
    const myPaddle = playerSide === 'left' ? leftPaddle : rightPaddle;
    if (['w', 'W', 's', 'S', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        myPaddle.stop();
    }
};

export function initializeGame() {
    console.debug('Initializing game...');

    // Stop previous animation if any
    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    const container = document.querySelector('.canvas-container') as HTMLElement;
    if (!container) {
        console.error('Canvas container not found');
        return false;
    }

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;
    canvas.style.border = '2px solid #0ff';
    canvas.style.borderRadius = '15px';
    canvas.style.display = 'block';
    canvas.style.margin = '10px auto';
    canvas.style.backgroundColor = 'rgba(10, 10, 10, 0.9)';
    canvas.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
    canvas.style.maxWidth = '100%';
    canvas.style.height = 'auto';

    container.innerHTML = ''; // Clean up previous canvas
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    c = canvas;
    ctxt = ctx;
    gameStarted = false;
    awaitingServe = false;
    gameOver = false;
    leftScore = 0;
    rightScore = 0;
    currentGameId = null;
    playerSide = 'left';
    isRemote = false;
    aiMode = false;
    winnerName = null;

    leftPaddle = new Paddle(c, ctxt, 0, (c.height - 100) / 2, '#0ff');
    rightPaddle = new Paddle(c, ctxt, (c.width - 10), (c.height - 100) / 2, '#f0f');
    pongBall = new PongBall(c, ctxt);
    countdown = new CountDown();

    setupSocketListeners();
    setupInputListeners();
    setupMenuButtons();
    checkUrlForGame();

    return true;
}

function setupSocketListeners() {
    // Clear previous listeners to avoid duplicates in SPA
    gameSocket.socket.off('game_start');
    gameSocket.socket.off('opponent_move');
    gameSocket.socket.off('ball_update');
    gameSocket.socket.off('game_over');

    gameSocket.socket.on('game_start', (game: any) => {
        console.log('Game starting!', game);
        currentGameId = game.id;
        isRemote = true;

        // Improve identification: use userData if available, otherwise fallback to finding by socket ID if server provides it
        const me = game.players.find((p: any) =>
            (gameSocket.userData && (p.id === gameSocket.userData.id || p.username === gameSocket.userData.username)) ||
            (p.socketId === gameSocket.socket.id)
        );

        playerSide = me?.side || playerSide; // Stay with previous guess if me not found

        const infoBox = document.getElementById('game-info');
        if (infoBox) {
            infoBox.innerHTML = `<span class="text-green-400 font-bold">Match Started!</span> Side: ${playerSide}`;
            setTimeout(() => infoBox.classList.add('hidden'), 3000);
        }

        countdown.start(() => {
            gameStarted = true;
            if (playerSide === 'left') pongBall.start();
        });
    });

    gameSocket.socket.on('waiting_for_opponent', () => {
        console.log('Socket event: waiting_for_opponent');
        const infoBox = document.getElementById('game-info');
        if (infoBox) {
            infoBox.innerHTML = `Game ID: <span class="text-yellow-400 font-bold select-all">${currentGameId}</span><br>
                                 <span class="text-blue-400">Waiting for an opponent to join...</span>`;
        }
    });

    gameSocket.socket.on('error', (msg: string) => {
        console.error('Socket event: error', msg);
        const infoBox = document.getElementById('game-info');
        if (infoBox) {
            infoBox.innerHTML = `<span class="text-red-500">Error: ${msg}</span>`;
            setTimeout(() => infoBox.classList.add('hidden'), 5000);
        }
    });

    gameSocket.socket.on('game_full', () => {
        console.warn('Socket event: game_full');
        const infoBox = document.getElementById('game-info');
        if (infoBox) {
            infoBox.innerHTML = `<span class="text-red-500">This game is already full!</span>`;
        }
    });

    gameSocket.socket.on('opponent_move', (data: any) => {
        if (data.side === 'left') leftPaddle.setY(data.y);
        else rightPaddle.setY(data.y);
    });

    gameSocket.socket.on('ball_update', (data: any) => {
        if (isRemote) {
            // If we are on the right, we must sync the ball position from the host
            if (playerSide === 'right') {
                pongBall.syncState(data.ball);
            }
            // Everyone syncs the score from the authoritative server broadcast
            leftScore = data.score.left;
            rightScore = data.score.right;
        }
    });

    gameSocket.socket.on('game_over', (data: any) => {
        console.log('Game Over received:', data);
        gameOver = true;
        gameStarted = false;

        // Sync final scores from server to ensure loser sees the 11 (or 5)
        if (data.score) {
            leftScore = data.score.left;
            rightScore = data.score.right;
        }

        winnerName = data.winner?.username || (leftScore > rightScore ? 'Left Player' : 'Right Player');
        drawWin(winnerName + ' Wins!');
    });
}

function setupInputListeners() {
    // Always remove first to avoid duplicates in SPAs
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}

function setupMenuButtons() {
    const btnRemote = document.getElementById('btn-remote');
    if (btnRemote) {
        btnRemote.onclick = startRemoteGame;
    }

    const btnJoin = document.getElementById('btn-join');
    if (btnJoin) {
        btnJoin.onclick = joinMatch;
    }

    const btnAI = document.getElementById('btn-ai');
    if (btnAI) {
        btnAI.onclick = () => {
            aiMode = true;
            isRemote = false;
            countdown.start(() => { gameStarted = true; pongBall.start(); });
        };
    }

    const btnFriend = document.getElementById('btn-friend');
    if (btnFriend) {
        btnFriend.onclick = () => {
            aiMode = false;
            isRemote = false;
            countdown.start(() => { gameStarted = true; pongBall.start(); });
        };
    }
}

async function startRemoteGame() {
    const infoBox = document.getElementById('game-info');
    if (infoBox) {
        infoBox.innerText = 'Creating session...';
        infoBox.classList.remove('hidden');
    }

    gameSocket.connect();
    const gameId = await gameSocket.createGame();
    if (gameId) {
        currentGameId = gameId;
        isRemote = true;
        playerSide = 'left';

        const emitJoin = () => {
            console.log('Socket connected, emitting join_game for creator');
            gameSocket.socket.emit('join_game', gameId);
        };

        if (gameSocket.socket.connected) {
            emitJoin();
        } else {
            gameSocket.socket.once('connect', emitJoin);
        }

        if (infoBox) {
            infoBox.innerHTML = `Game Created! ID: <span class="text-yellow-400 font-bold select-all">${gameId}</span><br><small class="text-gray-400">Waiting for opponent...</small>`;
        }
    } else if (infoBox) {
        infoBox.innerText = 'Failed to create game. Check console.';
    }
}

async function joinMatch() {
    const input = document.getElementById('join-id') as HTMLInputElement;
    const gameId = input?.value.trim();
    const infoBox = document.getElementById('game-info');

    if (!gameId) {
        if (infoBox) {
            infoBox.innerText = 'Please enter a valid Match ID';
            infoBox.classList.remove('hidden');
        }
        return;
    }

    if (infoBox) {
        infoBox.innerText = 'Joining match...';
        infoBox.classList.remove('hidden');
    }

    if (infoBox) {
        infoBox.innerText = 'Connecting to server...';
        infoBox.classList.remove('hidden');
    }

    gameSocket.connect();

    // Attach a one-time listener for connection errors specifically for this join attempt
    gameSocket.socket.once('connect_error', (err) => {
        if (infoBox) infoBox.innerHTML = `<span class="text-red-500">Connection Failed: ${err.message}</span>`;
    });

    const performJoin = () => {
        if (infoBox) infoBox.innerText = 'Joining match...';
        currentGameId = gameId;
        isRemote = true;
        playerSide = 'right';
        gameSocket.socket.emit('join_game', gameId);
    };

    if (gameSocket.socket.connected) {
        performJoin();
    } else {
        gameSocket.socket.once('connect', performJoin);
    }
}

function checkUrlForGame() {
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('gameId');
    if (gameId) {
        gameSocket.connect();
        currentGameId = gameId;
        isRemote = true;
        playerSide = 'right';
        gameSocket.socket.emit('join_game', gameId);
    }
}

export function animate() {
    animationId = requestAnimationFrame(animate);
    if (!ctxt) return;

    ctxt.clearRect(0, 0, c.width, c.height);

    if (aiMode && gameStarted) {
        const paddleCenter = rightPaddle.y + rightPaddle.heightPaddle / 2;
        const diff = pongBall.y - paddleCenter;
        if (Math.abs(diff) > 6) {
            rightPaddle.scroll = diff > 0 ? rightPaddle.speed : -rightPaddle.speed;
        } else {
            rightPaddle.scroll = 0;
        }
    }

    const myPaddle = playerSide === 'left' ? leftPaddle : rightPaddle;
    const oldY = myPaddle.getY();

    leftPaddle.update();
    rightPaddle.update();

    // If my paddle moved, emit the new position to the server
    if (isRemote && currentGameId && myPaddle.getY() !== oldY) {
        gameSocket.socket.emit('paddle_move', { gameId: currentGameId, y: myPaddle.getY() });
    }

    drawScores();

    if (gameStarted && !gameOver) {
        // Only host calculates ball in remote mode, or both in local
        if (!isRemote || playerSide === 'left') {
            const scorer = pongBall.update(leftPaddle, rightPaddle);

            if (scorer) {
                if (scorer === 'left') leftScore++;
                else rightScore++;

                if (leftScore >= winningScore || rightScore >= winningScore) {
                    gameOver = true;
                    gameStarted = false;
                } else {
                    pongBall.resetPositionAndSpeed();
                    gameStarted = false;
                    setTimeout(() => { if (!gameOver) { pongBall.start(); gameStarted = true; } }, 1000);
                }
            }

            // ALWAYS sync after update/score increment to ensure server sees the final state
            if (isRemote && currentGameId) {
                gameSocket.socket.emit('ball_sync', {
                    gameId: currentGameId,
                    ball: pongBall.getState(),
                    score: { left: leftScore, right: rightScore }
                });
            }
        }
    }

    leftPaddle.draw();
    rightPaddle.draw();
    pongBall.draw();

    if (gameOver) {
        if (isRemote) {
            const displayWinner = winnerName || (leftScore > rightScore ? 'Left Player' : 'Right Player');
            drawWin(displayWinner + ' Wins!');
        } else {
            const winner = leftScore >= winningScore ? 'Left Player' : 'Right Player';
            drawWin(winner + ' Wins!');
        }
    }
}

function drawScores() {
    ctxt.fillStyle = '#fff';
    ctxt.font = '30px "Share Tech Mono", monospace';
    ctxt.textAlign = 'center';
    ctxt.fillText(String(leftScore), c.width * 0.25, 50);
    ctxt.fillText(String(rightScore), c.width * 0.75, 50);
}

function drawWin(text: string) {
    ctxt.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctxt.fillRect(0, 0, c.width, c.height);
    ctxt.fillStyle = '#0ff';
    ctxt.font = '50px "Share Tech Mono", monospace';
    ctxt.textAlign = 'center';
    ctxt.fillText(text, c.width / 2, c.height / 2);
    ctxt.font = '20px "Share Tech Mono", monospace';
    ctxt.fillText('Press F5 to restart', c.width / 2, c.height / 2 + 70);
}
