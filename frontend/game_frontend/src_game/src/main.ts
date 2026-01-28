import { Paddle } from './Paddle';
import { PongBall } from './PongBall';
import CountDown from './CountDown';
import '../css/gameCountDown.css';
import '../css/gameLobby.css';
import '../css/gameVisuals.css';
import { gameSocket } from './services/gameSocket';
import { getSocketInstance } from '../../../socket_manager/socket';

console.debug('Game module loaded');

// Game state variables
let c: HTMLCanvasElement;
let ctxt: CanvasRenderingContext2D;
let gameStarted = false;
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
let gameMode: string | null = null;
let goalTimeout: number | null = null;

function resetLocalState() {
    console.debug('Resetting local game state');
    if (goalTimeout) {
        clearTimeout(goalTimeout);
        goalTimeout = null;
    }
    gameStarted = false;
    gameOver = false;
    leftScore = 0;
    rightScore = 0;
    winnerName = null;

    if (leftPaddle) leftPaddle.setY((c.height - 100) / 2);
    if (rightPaddle) rightPaddle.setY((c.height - 100) / 2);
    if (pongBall) pongBall.resetPositionAndSpeed();

    // Update Scores in HTML
    const scoreLeftEl = document.getElementById('score-left');
    const scoreRightEl = document.getElementById('score-right');
    if (scoreLeftEl) scoreLeftEl.textContent = '0';
    if (scoreRightEl) scoreRightEl.textContent = '0';

    // Hide overlays
    const infoBox = document.getElementById('game-info');
    if (infoBox) infoBox.classList.add('hidden');
    const endControls = document.getElementById('end-game-controls');
    if (endControls) endControls.classList.add('hidden');
}

// Color State

// Color State
let leftPaddleColor = '#ff0000';
let rightPaddleColor = '#ff8c00';
let ballColor = '#ff4500';
let arenaColor = '#100505';

// Define listeners outside to allow proper removal and avoid accumulation
const handleKeyDown = (e: KeyboardEvent) => {
    if (!gameStarted || gameOver) return;

    if (isRemote) {
        const myPaddle = playerSide === 'left' ? leftPaddle : rightPaddle;
        if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
            e.preventDefault();
            myPaddle.moveUp();
        }
        if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
            e.preventDefault();
            myPaddle.moveDown();
        }
    } else {
        // Local mode
        const leftUp = e.key === 'w' || e.key === 'W' || (aiMode && e.key === 'ArrowUp');
        const leftDown = e.key === 's' || e.key === 'S' || (aiMode && e.key === 'ArrowDown');

        if (leftUp) {
            e.preventDefault();
            leftPaddle.moveUp();
        }
        if (leftDown) {
            e.preventDefault();
            leftPaddle.moveDown();
        }

        if (!aiMode) {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                rightPaddle.moveUp();
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                rightPaddle.moveDown();
            }
        }
    }
};

const handleKeyUp = (e: KeyboardEvent) => {
    if (isRemote) {
        const myPaddle = playerSide === 'left' ? leftPaddle : rightPaddle;
        if (['w', 'W', 's', 'S', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            myPaddle.stop();
        }
    } else {
        // Local mode
        const leftKey = ['w', 'W', 's', 'S'].includes(e.key) || (aiMode && ['ArrowUp', 'ArrowDown'].includes(e.key));
        if (leftKey) {
            leftPaddle.stop();
        }

        if (!aiMode && ['ArrowUp', 'ArrowDown'].includes(e.key)) {
            rightPaddle.stop();
        }
    }
};

export function initializeGame() {
    console.debug('Initializing game...');

    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    const container = document.querySelector('.canvas-container') as HTMLElement;
    if (!container) return false;

    container.innerHTML = `
        <div class="relative w-full h-full flex flex-col items-center justify-center rounded-[2rem] overflow-hidden isolate">
            <!-- HUD Layer -->
            <div class="absolute top-8 left-0 w-full px-12 flex justify-between items-start z-30 pointer-events-none select-none">
                <!-- Left Player -->
                <div class="flex flex-col items-center gap-4 animate-slide-in-left">
                    <div class="relative group pointer-events-auto">
                        <div class="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                        <div class="relative w-28 h-28 rounded-full border-2 border-red-400/50 shadow-[0_0_30px_rgba(239,68,68,0.4)] overflow-hidden bg-black/40 backdrop-blur-md transition-all duration-500 hover:scale-110 hover:rotate-3 ring-4 ring-red-500/20">
                            <img id="avatar-left" src="" alt="Left Player" class="w-full h-full object-cover">
                        </div>
                    </div>
                    <div class="px-6 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl transition-all hover:border-red-500/30">
                        <span id="name-left" class="text-red-400 font-black font-mono tracking-[0.2em] text-xs uppercase drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">Player 1</span>
                    </div>
                </div>

            <!-- Score Display -->
            <div class="flex items-center gap-8">
                <div class="px-8 py-4 rounded-2xl bg-black/60 border-2 border-red-500/30 backdrop-blur-xl shadow-2xl">
                    <span id="score-left" class="text-5xl font-black text-red-500 font-mono drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] tracking-wider">0</span>
                </div>
                <div class="text-4xl font-black text-white/20">-</div>
                <div class="px-8 py-4 rounded-2xl bg-black/60 border-2 border-red-600/30 backdrop-blur-xl shadow-2xl">
                    <span id="score-right" class="text-5xl font-black text-red-600 font-mono drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] tracking-wider">0</span>
                </div>
            </div>

            <!-- Right Player -->
            <div class="flex flex-col items-center gap-4 animate-slide-in-right">
                    <div class="relative group pointer-events-auto">
                        <div class="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                        <div class="relative w-28 h-28 rounded-full border-2 border-red-400/50 shadow-[0_0_30px_rgba(239,68,68,0.4)] overflow-hidden bg-black/40 backdrop-blur-md transition-all duration-500 hover:scale-110 hover:-rotate-3 ring-4 ring-red-500/20">
                            <img id="avatar-right" src="" alt="Right Player" class="w-full h-full object-cover">
                        </div>
                    </div>
                    <div class="px-6 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl transition-all hover:border-red-500/30">
                        <span id="name-right" class="text-red-400 font-black font-mono tracking-[0.2em] text-xs uppercase drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">Player 2</span>
                    </div>
                </div>
            </div>

            <!-- Canvas Wrapper -->
            <div class="relative w-full h-full flex items-center justify-center p-12 pt-48">
                <div id="canvas-mount" class="relative z-10 rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 backdrop-blur-2xl transition-transform duration-700"></div>
                
                <!-- Inner Ambient Glow -->
                <div class="absolute inset-0 pointer-events-none z-20 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
                <div id="game-info" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 hidden px-12 py-6 bg-black/90 backdrop-blur-2xl border-2 border-white/10 rounded-[2.5rem] text-3xl font-black text-white shadow-[0_0_80px_rgba(0,0,0,0.9)] animate-bounce-in tracking-tighter"></div>
                
                <!-- End Game Controls -->
                <div id="end-game-controls" class="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 hidden flex items-center gap-6 animate-bounce-in">
                    <button id="btn-rematch" class="px-10 py-4 bg-orange-500/10 hover:bg-orange-500/20 border-2 border-orange-500/50 hover:border-orange-500 rounded-2xl text-orange-500 font-extrabold tracking-widest uppercase text-sm backdrop-blur-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(251,146,60,0.2)] hover:shadow-[0_0_50px_rgba(251,146,60,0.4)] flex items-center gap-3 group">
                        <span class="material-symbols-outlined text-orange-500/50 group-hover:text-orange-400 transition-colors">replay</span>
                        Rematch
                    </button>
                    <button id="btn-return-lobby" class="px-10 py-4 bg-red-500/10 hover:bg-red-500/20 border-2 border-red-500/50 hover:border-red-500 rounded-2xl text-red-500 font-extrabold tracking-widest uppercase text-sm backdrop-blur-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(239,68,68,0.2)] hover:shadow-[0_0_50px_rgba(239,68,68,0.4)] flex items-center gap-3 group">
                        <span class="material-symbols-outlined text-red-500/50 group-hover:text-red-400 transition-colors">home</span>
                        Lobby
                    </button>
                </div>
            </div>
        </div>
    `;

    // Attach Lobby Color Listeners (if present in DOM)
    setupLobbyColorListeners();

    const mount = container.querySelector('#canvas-mount');
    const canvas = document.createElement('canvas');
    canvas.id = 'game-canvas';
    canvas.width = 800;
    canvas.height = 400;
    if (mount) mount.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    c = canvas;
    ctxt = ctx;
    // Clear loop if already exists
    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    resetLocalState();
    currentGameId = null;
    playerSide = 'left';
    isRemote = false;
    aiMode = false;

    updateLocalAvatars();

    leftPaddle = new Paddle(c, ctxt, 0, (c.height - 100) / 2, leftPaddleColor);
    rightPaddle = new Paddle(c, ctxt, (c.width - 10), (c.height - 100) / 2, rightPaddleColor);
    pongBall = new PongBall(c, ctxt, ballColor);
    pongBall.radius = 10;
    countdown = new CountDown();

    setupSocketListeners();
    setupInputListeners();
    setupMenuButtons();
    setupVisibilityListener();
    checkUrlForGame();

    updateLocalAvatars();

    return true;
}

function setupSocketListeners() {
    console.log('[DEBUG] Setting up socket listeners...');
    const s = gameSocket.socket;

    s.off('game_start');
    s.off('waiting_for_opponent');
    s.off('error');
    s.off('game_full');
    s.off('opponent_move');
    s.off('ball_update');
    s.off('game_over');
    s.off('player_left');

    s.on('game_start', (game: any) => {
        console.log('[DEBUG] game_start received!', game);
        gameOver = false;
        gameStarted = false;
        currentGameId = game.id;
        isRemote = true;

        const myId = gameSocket.userData?.id || localStorage.getItem('userId');
        const me = game.players.find((p: any) => p.socketId === s.id) ||
            game.players.find((p: any) => myId && String(p.id) === String(myId)) ||
            game.players.find((p: any) => gameSocket.userData && p.username === gameSocket.userData.username);

        if (me) {
            playerSide = me.side;
            console.log(`[DEBUG] Identified as ${playerSide} player.`);
        }

        if (game.score) {
            leftScore = game.score.left;
            rightScore = game.score.right;
            console.log('[DEBUG] Score synced from game_start:', { left: leftScore, right: rightScore });
            // Immediately update HTML score display
            const scoreLeftEl = document.getElementById('score-left');
            const scoreRightEl = document.getElementById('score-right');
            if (scoreLeftEl) scoreLeftEl.textContent = String(leftScore);
            if (scoreRightEl) scoreRightEl.textContent = String(rightScore);

            // If it's a rematch (score is 0), show a special message
            if (leftScore === 0 && rightScore === 0) {
                const infoBox = document.getElementById('game-info');
                if (infoBox) {
                    infoBox.classList.remove('hidden');
                    infoBox.innerHTML = `<span class="text-green-500 font-bold">REMATCH ACCEPTED!</span>`;
                    setTimeout(() => infoBox.classList.add('hidden'), 2000);
                }
            }
        }
        if (game.paddles) {
            leftPaddle.setY(game.paddles.left);
            rightPaddle.setY(game.paddles.right);
        }
        if (game.ball) {
            pongBall.syncState(game.ball);
        }

        updateRemoteAvatars(game.players);

        const infoBox = document.getElementById('game-info');
        if (infoBox) {
            infoBox.classList.remove('hidden');
            infoBox.innerHTML = `Match Started! You are <span class="text-orange-500 font-bold">${playerSide.toUpperCase()}</span>`;
            setTimeout(() => infoBox.classList.add('hidden'), 3000);
        }

        countdown.start(() => {
            gameStarted = true;
            // Only start ball locally if NOT remote
            if (!isRemote) pongBall.start();
        });

        // Hide End Game Controls if they were visible
        const endControls = document.getElementById('end-game-controls');
        if (endControls) endControls.classList.add('hidden');
    });

    s.on('rematch_requested', (data: any) => {
        const infoBox = document.getElementById('game-info');
        if (infoBox) {
            infoBox.classList.remove('hidden');
            infoBox.innerHTML = `<span class="text-orange-400 font-bold">${data.from}</span> wants a rematch!`;
            // Keep it visible for a bit or until game starts
        }
    });

    s.on('waiting_for_opponent', () => {
        gameOver = false;
        gameStarted = false;
        leftScore = 0;
        rightScore = 0;
        const scoreLeftEl = document.getElementById('score-left');
        const scoreRightEl = document.getElementById('score-right');
        if (scoreLeftEl) scoreLeftEl.textContent = '0';
        if (scoreRightEl) scoreRightEl.textContent = '0';

        const endControls = document.getElementById('end-game-controls');
        if (endControls) endControls.classList.add('hidden');

        const infoBox = document.getElementById('game-info');
        if (infoBox) {
            infoBox.classList.remove('hidden');
            infoBox.innerHTML = `Game ID: <span class="text-yellow-400 font-bold select-all">${currentGameId}</span><br>Waiting for opponent...`;
        }
    });

    s.on('opponent_move', (data: any) => {
        if (data.side === 'left') leftPaddle.setY(data.y);
        else rightPaddle.setY(data.y);
    });

    s.on('ball_update', (data: any) => {
        if (isRemote) {
            pongBall.syncState(data.ball);
            leftScore = data.score.left;
            rightScore = data.score.right;
            // Update HTML immediately
            const scoreLeftEl = document.getElementById('score-left');
            const scoreRightEl = document.getElementById('score-right');
            if (scoreLeftEl) scoreLeftEl.textContent = String(leftScore);
            if (scoreRightEl) scoreRightEl.textContent = String(rightScore);
        }
    });

    s.on('goal_scored', (data: any) => {
        console.log('[DEBUG] Goal Scored!', data);
        pongBall.syncState(data.ball);
        leftScore = data.score.left;
        rightScore = data.score.right;
        console.log('[DEBUG] Score updated via goal_scored:', { left: leftScore, right: rightScore });
        // Update HTML immediately
        const scoreLeftEl = document.getElementById('score-left');
        const scoreRightEl = document.getElementById('score-right');
        if (scoreLeftEl) scoreLeftEl.textContent = String(leftScore);
        if (scoreRightEl) scoreRightEl.textContent = String(rightScore);
        // No countdown, just wait for server to restart ball
    });

    s.on('game_over', (data: any) => {
        gameOver = true;
        gameStarted = false;
        if (data.score) {
            leftScore = data.score.left;
            rightScore = data.score.right;
        }
        winnerName = data.winner?.username || (leftScore > rightScore ? 'Left Player' : 'Right Player');
        drawWin(winnerName + ' Wins!');

        // Show Return to Lobby button
        const btnLobby = document.getElementById('btn-return-lobby');
        if (btnLobby) btnLobby.classList.remove('hidden');
        if (gameMode === 'tournament') {
            const tSocket = getSocketInstance();
            if (tSocket) {
                const tournamentName = URLSearchParams.prototype.get.call(new URL(window.location.href).searchParams, 'TournamentName');
                const final = URLSearchParams.prototype.get.call(new URL(window.location.href).searchParams, 'final');
                console.log('[DEBUG] Preparing to emit match:result for tournament mode.', tournamentName, final);
                const result = {
                    gameId: currentGameId,
                    winnerId: data.winner?.id,
                    loserId: data.players?.find((p: any) => p.id !== data.winner?.id)?.id,
                    score: data.score, 
                    tournamentName: tournamentName,
                    final: final
                };
                console.log('[DEBUG] Tournament mode detected. Emitting match:result', result);
                tSocket.emit('match:result', result);
            }
        }
    });

    s.on('player_left', () => {
        const infoBox = document.getElementById('game-info');
        if (infoBox) {
            infoBox.classList.remove('hidden');
            infoBox.innerHTML = `<span class="text-orange-500">Opponent left the match.</span>`;
        }
        gameStarted = false;
        gameOver = true;

        // Show Return to Lobby button
        const btnLobby = document.getElementById('btn-return-lobby');
        if (btnLobby) btnLobby.classList.remove('hidden');
    });
}

function setupInputListeners() {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}

function setupVisibilityListener() {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

const handleVisibilityChange = () => {
    if (document.hidden) {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    } else {
        if (!gameOver && !animationId) animate();
    }
};

const showGameView = () => {
    const lobby = document.getElementById('game-lobby');
    const container = document.getElementById('game-container');
    if (lobby) lobby.classList.add('hidden');
    if (container) container.classList.remove('hidden');

    resetLocalState();

    // Resume animation if it was stopped
    if (!animationId) animate();
};

const showLobbyView = () => {
    const lobby = document.getElementById('game-lobby');
    const container = document.getElementById('game-container');
    if (lobby) lobby.classList.remove('hidden');
    if (container) container.classList.add('hidden');

    // Stop the game loop and clean up
    gameStarted = false;
    gameOver = true;
    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    resetLocalState();

    // Disconnect socket if remote
    if (isRemote) {
        gameSocket.disconnect();
        isRemote = false;
    }
};

function setupMenuButtons() {
    const toggleJoin = document.getElementById('toggle-join');
    const joinSection = document.getElementById('join-section');

    if (toggleJoin && joinSection) {
        toggleJoin.onclick = () => {
            joinSection.classList.toggle('hidden');
            toggleJoin.innerText = joinSection.classList.contains('hidden') ? 'Or join an existing match with ID' : 'Hide join section';
        };
    }

    const btnRemote = document.getElementById('btn-remote');
    if (btnRemote) btnRemote.onclick = () => { showGameView(); startRemoteGame(); };

    const btnJoin = document.getElementById('btn-join');
    if (btnJoin) btnJoin.onclick = () => joinMatch();

    const btnAI = document.getElementById('btn-ai');
    if (btnAI) btnAI.onclick = () => {
        aiMode = true; isRemote = false; showGameView();
        const infoBox = document.getElementById('game-info');
        if (infoBox) {
            infoBox.classList.remove('hidden');
            infoBox.innerHTML = `<span class="text-red-500 font-bold">Practice vs AI</span>`;
            setTimeout(() => infoBox.classList.add('hidden'), 3000);
        }
        countdown.start(() => { gameStarted = true; pongBall.start(); });
    };

    const btnFriend = document.getElementById('btn-friend');
    if (btnFriend) btnFriend.onclick = () => {
        aiMode = false; isRemote = false; showGameView();
        const infoBox = document.getElementById('game-info');
        if (infoBox) {
            infoBox.classList.remove('hidden');
            infoBox.innerHTML = `<span class="text-yellow-500 font-bold">Local Multiplayer</span>`;
            setTimeout(() => infoBox.classList.add('hidden'), 3000);
        }
        countdown.start(() => { gameStarted = true; pongBall.start(); });
    };

    const btnReturnLobby = document.getElementById('btn-return-lobby');
    if (btnReturnLobby) {
        btnReturnLobby.onclick = () => {
            showLobbyView();
        };
    }

    const btnRematch = document.getElementById('btn-rematch');
    if (btnRematch) {
        btnRematch.onclick = () => {
            console.log('[DEBUG] Rematch button clicked. isRemote:', isRemote, 'gameId:', currentGameId);
            if (isRemote && currentGameId) {
                // Remote Rematch
                console.log('[DEBUG] Emitting request_rematch for', currentGameId);
                gameSocket.socket.emit('request_rematch', { gameId: currentGameId });

                // Visual feedback
                btnRematch.classList.add('opacity-50', 'pointer-events-none');
                const btnText = btnRematch.childNodes[2]; // Text node after span icon
                if (btnText) btnText.textContent = ' Waiting...';

                return;
            }

            const endControls = document.getElementById('end-game-controls');
            if (endControls) endControls.classList.add('hidden');

            resetLocalState();

            // Re-identify mode info
            const infoBox = document.getElementById('game-info');
            if (infoBox) {
                infoBox.classList.remove('hidden');
                infoBox.innerHTML = aiMode ?
                    `<span class="text-red-500 font-bold">Practice vs AI</span>` :
                    `<span class="text-yellow-500 font-bold">Local Multiplayer</span>`;
                setTimeout(() => infoBox.classList.add('hidden'), 3000);
            }

            // Start countdown again
            countdown.start(() => {
                gameStarted = true;
                pongBall.start();
            });
        };
    }
}

async function startRemoteGame() {
    gameSocket.connect();
    const gameId = await gameSocket.createGame();
    if (gameId) {
        currentGameId = gameId;
        isRemote = true;
        playerSide = 'left';
        gameSocket.socket.emit('join_game', { gameId, side: 'left' });
    }
}

async function joinMatch() {
    const input = document.getElementById('join-id') as HTMLInputElement;
    const gameId = input?.value.trim();
    if (!gameId) return;

    showGameView();
    gameSocket.connect();
    currentGameId = gameId;
    isRemote = true;
    playerSide = 'right';
    gameSocket.socket.emit('join_game', { gameId, side: 'right' });
}

function checkUrlForGame() {
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('gameId');
    const sideParam = params.get('side');
    const modeParam = params.get('mode');
    if (gameId) {
        showGameView();
        gameSocket.connect();
        currentGameId = gameId;
        isRemote = true;
        gameMode = modeParam;
        playerSide = (sideParam === 'left' || sideParam === 'right') ? sideParam : 'right';
        gameSocket.socket.emit('join_game', { gameId, side: playerSide });
    }
}

export function animate() {
    animationId = requestAnimationFrame(animate);
    if (!ctxt) return;

    drawPremiumBackground();

    if (aiMode && gameStarted) {
        const paddleCenter = rightPaddle.y + rightPaddle.heightPaddle / 2;
        const diff = pongBall.y - paddleCenter;
        if (Math.abs(diff) > 6) rightPaddle.scroll = diff > 0 ? rightPaddle.speed : -rightPaddle.speed;
        else rightPaddle.scroll = 0;
    }

    const myPaddle = playerSide === 'left' ? leftPaddle : rightPaddle;
    const oldY = myPaddle.getY();

    leftPaddle.update();
    rightPaddle.update();

    if (isRemote && currentGameId && myPaddle.getY() !== oldY) {
        gameSocket.socket.emit('paddle_move', { gameId: currentGameId, y: myPaddle.getY() });
    }

    drawScores();

    if (gameStarted && !gameOver) {
        if (!isRemote) {
            const scorer = pongBall.update(leftPaddle, rightPaddle);
            if (scorer) {
                if (scorer === 'left') leftScore++;
                else rightScore++;
                if (leftScore >= winningScore || rightScore >= winningScore) { gameOver = true; gameStarted = false; }
                else {
                    pongBall.resetPositionAndSpeed();
                    gameStarted = false;
                    goalTimeout = window.setTimeout(() => {
                        if (!gameOver) {
                            pongBall.start();
                            gameStarted = true;
                        }
                        goalTimeout = null;
                    }, 1000);
                }
            }
        }
    }

    leftPaddle.draw();
    rightPaddle.draw();
    pongBall.draw();

    if (gameOver) {
        const displayWinner = winnerName || (leftScore > rightScore ? 'Left Player' : 'Right Player');
        drawWin(displayWinner + ' Wins!');

        // Show End Game Controls
        const endControls = document.getElementById('end-game-controls');
        if (endControls) {
            endControls.classList.remove('hidden');

            // Reset button state (in case of rematch)
            const btnRematch = document.getElementById('btn-rematch');
            if (btnRematch) {
                btnRematch.classList.remove('opacity-50', 'pointer-events-none');
                const btnText = btnRematch.childNodes[2];
                if (btnText) btnText.textContent = ' Rematch';
                btnRematch.classList.remove('hidden');
            }
        }
    }
}

function drawScores() {
    // Update HTML score displays
    const scoreLeftEl = document.getElementById('score-left');
    const scoreRightEl = document.getElementById('score-right');

    if (scoreLeftEl) scoreLeftEl.textContent = String(leftScore);
    if (scoreRightEl) scoreRightEl.textContent = String(rightScore);

    // Draw center line on canvas
    ctxt.save();
    ctxt.setLineDash([10, 15]);
    ctxt.strokeStyle = 'rgba(255, 0, 0, 0.15)';
    ctxt.lineWidth = 2;
    ctxt.beginPath();
    ctxt.moveTo(c.width / 2, 0);
    ctxt.lineTo(c.width / 2, c.height);
    ctxt.stroke();
    ctxt.restore();
}

let bgOffset = 0;
function drawPremiumBackground() {
    // Fill with semi-transparency so backdrop-blur is visible
    ctxt.fillStyle = arenaColor + 'CC'; // ~80% opacity
    ctxt.fillRect(0, 0, c.width, c.height);
    ctxt.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctxt.lineWidth = 1;
    bgOffset = (bgOffset + 0.5) % 40;
    for (let x = 0; x <= c.width; x += 40) { ctxt.beginPath(); ctxt.moveTo(x, 0); ctxt.lineTo(x, c.height); ctxt.stroke(); }
    for (let y = 0; y <= c.height + 40; y += 40) { ctxt.beginPath(); ctxt.moveTo(0, y + bgOffset); ctxt.lineTo(c.width, y + bgOffset); ctxt.stroke(); }
}

function drawWin(text: string) {
    ctxt.save();
    ctxt.fillStyle = 'rgba(20, 0, 0, 0.9)';
    ctxt.fillRect(0, 0, c.width, c.height);
    ctxt.shadowColor = '#f00';
    ctxt.shadowBlur = 30;
    ctxt.fillStyle = '#f00';
    ctxt.font = '60px "Share Tech Mono", monospace';
    ctxt.textAlign = 'center';
    ctxt.fillText(text.toUpperCase(), c.width / 2, c.height / 2);
    ctxt.restore();
}

// Avatar Helpers
async function fetchUserProfile(userId?: string) {
    try {
        const url = userId ? `/api/users/user/${userId}` : '/api/users/User';
        const response = await fetch(url);
        if (!response.ok) return null;
        const json = await response.json();
        return json.user || json; // Unwrap if wrapped in { user: ... }
    } catch (e) { return null; }
}

async function updateLocalAvatars() {
    // Fetch current user via session if possible
    const profile = await fetchUserProfile();
    if (!profile) return;

    const avatarImg = document.getElementById('avatar-left') as HTMLImageElement;
    const nameSpan = document.getElementById('name-left');

    const getValidValue = (v: any) => (v && String(v) !== 'undefined' && String(v) !== 'null') ? v : null;

    // Resolve Avatar URL
    let avatarSrc = '/api/users/static/avatars/default.png';
    const rawAvatar = getValidValue(profile.avatar) || getValidValue(profile.avatar_url);
    if (rawAvatar) {
        if (rawAvatar.startsWith('http') || rawAvatar.startsWith('/')) {
            avatarSrc = rawAvatar;
        } else {
            avatarSrc = `/api/uploads/${rawAvatar}`;
        }
    }

    if (avatarImg) avatarImg.src = avatarSrc;
    if (nameSpan) {
        const name = getValidValue(profile.username) || getValidValue(profile.display_name) || getValidValue(profile.name);
        nameSpan.innerText = name || 'Player 1';
    }
}

async function updateRemoteAvatars(players: any[]) {
    for (const p of players) {
        const profile = await fetchUserProfile(p.id);
        if (!profile) continue;
        const side = p.side === 'left' ? 'left' : 'right';
        const avatarImg = document.getElementById(`avatar-${side}`) as HTMLImageElement;
        const nameSpan = document.getElementById(`name-${side}`);

        const getValidValue = (v: any) => (v && String(v) !== 'undefined' && String(v) !== 'null') ? v : null;

        // Resolve Avatar URL
        let avatarSrc = '/api/users/static/avatars/default.png';
        const rawAvatar = getValidValue(profile.avatar) || getValidValue(profile.avatar_url);
        if (rawAvatar) {
            if (rawAvatar.startsWith('http') || rawAvatar.startsWith('/')) {
                avatarSrc = rawAvatar;
            } else {
                avatarSrc = `/api/uploads/${rawAvatar}`;
            }
        }

        if (avatarImg) avatarImg.src = avatarSrc;
        if (nameSpan) {
            const name = getValidValue(profile.username) || getValidValue(profile.display_name) || getValidValue(profile.name);
            nameSpan.innerText = name || (side === 'left' ? 'Player 1' : 'Player 2');
        }
    }
}

// Setup listeners for the Main Menu (Lobby) color pickers
function setupLobbyColorListeners() {
    const HELLFIRE_PALETTE = [
        '#FF0000', // Red
        '#00FFFF', // Blue
        '#00FF00', // Green
        '#FFD700', // Gold
        '#9D00FF'  // Purple
    ];

    // Helper to update game state based on input ID
    const updateGameState = (targetId: string, color: string) => {
        if (targetId === 'lobby-color-left') {
            leftPaddleColor = color;
            if (leftPaddle) leftPaddle.color = color;
        } else if (targetId === 'lobby-color-right') {
            rightPaddleColor = color;
            if (rightPaddle) rightPaddle.color = color;
        } else if (targetId === 'lobby-color-ball') {
            ballColor = color;
            if (pongBall) pongBall.color = color;
        } else if (targetId === 'lobby-color-arena') {
            arenaColor = color;
        }
    };

    // Attach listeners to Carousel Arrows
    const arrows = document.querySelectorAll('.color-arrow');
    arrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            const targetId = arrow.getAttribute('data-target');
            const direction = arrow.getAttribute('data-dir'); // 'prev' or 'next'
            if (!targetId || !direction) return;

            // Get current color from the PREVIEW element
            const previewEl = document.getElementById(`preview-${targetId}`);
            if (!previewEl) return;

            const currentColor = previewEl.getAttribute('data-color') || '#FF0000';
            const currentIndex = HELLFIRE_PALETTE.indexOf(currentColor);

            // Calculate next index
            let nextIndex = 0;
            if (direction === 'next') {
                nextIndex = (currentIndex + 1) % HELLFIRE_PALETTE.length;
            } else {
                nextIndex = (currentIndex - 1 + HELLFIRE_PALETTE.length) % HELLFIRE_PALETTE.length;
            }

            const nextColor = HELLFIRE_PALETTE[nextIndex];

            // Update Preview DOM
            previewEl.setAttribute('data-color', nextColor);
            previewEl.style.backgroundColor = nextColor;
            previewEl.style.boxShadow = `0 0 10px ${nextColor}60`;

            // Update hidden input
            const input = document.getElementById(targetId) as HTMLInputElement;
            if (input) input.value = nextColor;

            // Update Game Logic
            updateGameState(targetId, nextColor);
        });
    });
}
