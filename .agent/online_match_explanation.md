# Explication Détaillée : Mode "Online Match" du Jeu Pong

## Vue d'ensemble

Le mode "Online Match" permet à deux joueurs de jouer au Pong en ligne via WebSocket. Ce document explique en détail toutes les étapes du processus, de la création d'une partie jusqu'à la fin du jeu.

---

## Architecture

### Composants Principaux

1. **Frontend (main.ts)** : Gère l'interface utilisateur, le rendu du jeu et les interactions
2. **GameSocketService (gameSocket.ts)** : Gère la communication WebSocket avec le serveur
3. **Backend (server.js)** : Coordonne les parties et synchronise l'état du jeu

---

## Étape 1 : Initialisation du Jeu

### Fonction : `initializeGame()` (lignes 144-264)

Lorsque le jeu se charge, cette fonction :

```typescript
export function initializeGame() {
    // 1. Annule toute animation en cours
    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    // 2. Crée le conteneur HTML pour le canvas
    const container = document.querySelector('.canvas-container');
    
    // 3. Génère le HTML avec :
    //    - Avatars des joueurs (gauche et droite)
    //    - Affichage des scores
    //    - Zone de canvas pour le jeu
    //    - Boutons de contrôle (Rematch, Return to Lobby)
    
    // 4. Crée le canvas de jeu (800x400)
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;
    
    // 5. Initialise les objets du jeu
    leftPaddle = new Paddle(...);   // Raquette gauche
    rightPaddle = new Paddle(...);  // Raquette droite
    pongBall = new PongBall(...);   // Balle
    countdown = new CountDown();     // Compte à rebours
    
    // 6. Configure les écouteurs d'événements
    setupSocketListeners();    // Événements WebSocket
    setupInputListeners();     // Clavier
    setupMenuButtons();        // Boutons du menu
    setupVisibilityListener(); // Visibilité de la page
    
    // 7. Vérifie si un gameId est dans l'URL
    checkUrlForGame();
}
```

**Points clés :**
- Réinitialise complètement l'état du jeu
- Crée l'interface visuelle avec les avatars et scores
- Prépare tous les objets de jeu (raquettes, balle)
- Configure tous les écouteurs nécessaires

---

## Étape 2 : Clic sur "Online Match"

### Fonction : `setupMenuButtons()` (lignes 545-632)

Quand l'utilisateur clique sur le bouton "Online Match" :

```typescript
const btnRemote = document.getElementById('btn-remote');
if (btnRemote) btnRemote.onclick = () => { 
    showGameView();      // Affiche la vue du jeu
    startRemoteGame();   // Démarre une partie en ligne
};
```

**Séquence :**
1. Cache le lobby
2. Affiche la vue du jeu
3. Appelle `startRemoteGame()`

---

## Étape 3 : Démarrage d'une Partie en Ligne

### Fonction : `startRemoteGame()` (lignes 634-643)

```typescript
async function startRemoteGame() {
    // 1. Connecte le socket au serveur
    gameSocket.connect();
    
    // 2. Crée une nouvelle partie via l'API REST
    const gameId = await gameSocket.createGame();
    
    if (gameId) {
        // 3. Stocke l'ID de la partie
        currentGameId = gameId;
        
        // 4. Active le mode distant
        isRemote = true;
        
        // 5. Le créateur est toujours le joueur de gauche
        playerSide = 'left';
        
        // 6. Rejoint la partie via WebSocket
        gameSocket.socket.emit('join_game', { 
            gameId, 
            side: 'left' 
        });
    }
}
```

### Détails de `gameSocket.createGame()` (gameSocket.ts, lignes 77-102)

```typescript
public async createGame(): Promise<string | null> {
    try {
        // 1. Récupère le token d'authentification
        const token = this.getCookie('token');
        
        // 2. Prépare les en-têtes HTTP
        const headers = { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        
        // 3. Envoie une requête POST à l'API
        const response = await fetch('/api/game/create', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({}),
            credentials: 'include'  // Envoie les cookies
        });
        
        // 4. Vérifie la réponse
        if (!response.ok) {
            console.error(`Game creation failed: ${response.status}`);
            return null;
        }
        
        // 5. Extrait et retourne le gameId
        const data = await response.json();
        return data.gameId;
        
    } catch (err) {
        console.error('Network error:', err);
        return null;
    }
}
```

**Points clés :**
- Utilise une requête REST pour créer la partie (pas WebSocket)
- Le serveur génère un `gameId` unique
- Le token d'authentification est envoyé pour identifier l'utilisateur

---

## Étape 4 : Configuration des Écouteurs WebSocket

### Fonction : `setupSocketListeners()` (lignes 266-485)

Cette fonction configure tous les événements WebSocket. Voici les principaux :

### 4.1 Événement : `waiting_for_opponent` (lignes 392-410)

Reçu quand le joueur attend un adversaire :

```typescript
s.on('waiting_for_opponent', () => {
    // 1. Réinitialise l'état du jeu
    gameOver = false;
    gameStarted = false;
    leftScore = 0;
    rightScore = 0;
    
    // 2. Met à jour l'affichage des scores
    document.getElementById('score-left').textContent = '0';
    document.getElementById('score-right').textContent = '0';
    
    // 3. Cache les contrôles de fin de partie
    document.getElementById('end-game-controls').classList.add('hidden');
    
    // 4. Affiche un message avec le Game ID
    const infoBox = document.getElementById('game-info');
    infoBox.classList.remove('hidden');
    infoBox.innerHTML = `
        Game ID: <span class="text-yellow-400">${currentGameId}</span>
        <br>Waiting for opponent...
    `;
});
```

**Ce qui se passe :**
- L'utilisateur voit l'ID de la partie
- Il peut partager cet ID avec un ami
- Le jeu attend qu'un deuxième joueur rejoigne

### 4.2 Événement : `game_start` (lignes 318-381)

Reçu quand les deux joueurs sont connectés :

```typescript
s.on('game_start', (game: any) => {
    console.log('[DEBUG] game_start received!', game);
    
    // 1. Réinitialise les flags
    gameOver = false;
    gameStarted = false;
    currentGameId = game.id;
    isRemote = true;
    
    // 2. Identifie le côté du joueur (left ou right)
    const myId = gameSocket.userData?.id || localStorage.getItem('userId');
    const me = game.players.find(p => 
        p.socketId === s.id ||
        (myId && String(p.id) === String(myId)) ||
        (gameSocket.userData && p.username === gameSocket.userData.username)
    );
    
    if (me) {
        playerSide = me.side;  // 'left' ou 'right'
        console.log(`[DEBUG] Identified as ${playerSide} player.`);
    }
    
    // 3. Synchronise les scores
    if (game.score) {
        leftScore = game.score.left;
        rightScore = game.score.right;
        
        // Met à jour l'affichage HTML
        document.getElementById('score-left').textContent = String(leftScore);
        document.getElementById('score-right').textContent = String(rightScore);
    }
    
    // 4. Synchronise les positions des raquettes
    if (game.paddles) {
        leftPaddle.setY(game.paddles.left);
        rightPaddle.setY(game.paddles.right);
    }
    
    // 5. Synchronise la position de la balle
    if (game.ball) {
        pongBall.syncState(game.ball);
    }
    
    // 6. Met à jour les avatars des joueurs
    updateRemoteAvatars(game.players);
    
    // 7. Affiche un message de confirmation
    const infoBox = document.getElementById('game-info');
    infoBox.classList.remove('hidden');
    infoBox.innerHTML = `
        Match Started! You are <span class="text-orange-500">${playerSide.toUpperCase()}</span>
    `;
    setTimeout(() => infoBox.classList.add('hidden'), 3000);
    
    // 8. Démarre le compte à rebours (3, 2, 1, GO!)
    countdown.start(() => {
        gameStarted = true;
        // La balle ne démarre PAS localement en mode remote
        // Le serveur gère le mouvement de la balle
    });
    
    // 9. Cache les contrôles de fin de partie
    document.getElementById('end-game-controls').classList.add('hidden');
});
```

**Points clés :**
- Le serveur envoie l'état complet du jeu
- Chaque joueur découvre son côté (left/right)
- Les positions sont synchronisées
- Le compte à rebours démarre

---

## Étape 5 : Gestion des Entrées Clavier

### Fonction : `handleKeyDown()` (lignes 85-123)

Quand le joueur appuie sur une touche :

```typescript
const handleKeyDown = (e: KeyboardEvent) => {
    // Ignore si le jeu n'a pas démarré ou est terminé
    if (!gameStarted || gameOver) return;
    
    if (isRemote) {
        // Mode en ligne : contrôle uniquement SA raquette
        const myPaddle = playerSide === 'left' ? leftPaddle : rightPaddle;
        
        if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
            e.preventDefault();
            myPaddle.moveUp();  // Démarre le mouvement vers le haut
        }
        
        if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
            e.preventDefault();
            myPaddle.moveDown();  // Démarre le mouvement vers le bas
        }
    } else {
        // Mode local : contrôle les deux raquettes
        // (code pour le mode local)
    }
};
```

### Fonction : `handleKeyUp()` (lignes 125-142)

Quand le joueur relâche une touche :

```typescript
const handleKeyUp = (e: KeyboardEvent) => {
    if (isRemote) {
        const myPaddle = playerSide === 'left' ? leftPaddle : rightPaddle;
        
        if (['w', 'W', 's', 'S', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            myPaddle.stop();  // Arrête le mouvement
        }
    } else {
        // Mode local
    }
};
```

**Points clés :**
- En mode remote, chaque joueur contrôle uniquement sa raquette
- Les touches W/S ou Flèches haut/bas déplacent la raquette
- Le mouvement s'arrête quand la touche est relâchée

---

## Étape 6 : Boucle d'Animation et Synchronisation

### Fonction : `animate()` (lignes 674-744)

Cette fonction s'exécute ~60 fois par seconde :

```typescript
export function animate() {
    // 1. Programme la prochaine frame
    animationId = requestAnimationFrame(animate);
    if (!ctxt) return;
    
    // 2. Dessine l'arrière-plan
    drawPremiumBackground();
    
    // 3. Récupère la raquette du joueur
    const myPaddle = playerSide === 'left' ? leftPaddle : rightPaddle;
    const oldY = myPaddle.getY();  // Position avant mise à jour
    
    // 4. Met à jour les positions des raquettes
    leftPaddle.update();   // Applique le mouvement
    rightPaddle.update();
    
    // 5. Si la position a changé, envoie au serveur
    if (isRemote && currentGameId && myPaddle.getY() !== oldY) {
        gameSocket.socket.emit('paddle_move', { 
            gameId: currentGameId, 
            y: myPaddle.getY() 
        });
    }
    
    // 6. Dessine les scores
    drawScores();
    
    // 7. Gestion de la balle (UNIQUEMENT en mode local)
    if (gameStarted && !gameOver) {
        if (!isRemote) {
            // En mode local : calcule la physique de la balle
            const scorer = pongBall.update(leftPaddle, rightPaddle);
            
            if (scorer) {
                // Un joueur a marqué
                if (scorer === 'left') leftScore++;
                else rightScore++;
                
                // Vérifie si quelqu'un a gagné
                if (leftScore >= winningScore || rightScore >= winningScore) {
                    gameOver = true;
                    gameStarted = false;
                } else {
                    // Réinitialise la balle après 1 seconde
                    pongBall.resetPositionAndSpeed();
                    gameStarted = false;
                    setTimeout(() => {
                        if (!gameOver) {
                            pongBall.start();
                            gameStarted = true;
                        }
                    }, 1000);
                }
            }
        }
        // En mode remote : la balle est mise à jour via WebSocket
    }
    
    // 8. Dessine tous les éléments
    leftPaddle.draw();
    rightPaddle.draw();
    pongBall.draw();
    
    // 9. Si le jeu est terminé, affiche le gagnant
    if (gameOver) {
        const displayWinner = winnerName || 
            (leftScore > rightScore ? 'Left Player' : 'Right Player');
        drawWin(displayWinner + ' Wins!');
        
        // Affiche les boutons Rematch et Return to Lobby
        document.getElementById('end-game-controls').classList.remove('hidden');
    }
}
```

**Points clés :**
- La boucle tourne en continu pour le rendu
- Chaque joueur envoie UNIQUEMENT sa position de raquette
- En mode remote, le serveur gère la physique de la balle
- Les mouvements sont fluides grâce à `requestAnimationFrame`

---

## Étape 7 : Réception des Mouvements de l'Adversaire

### Événement : `opponent_move` (lignes 412-415)

```typescript
s.on('opponent_move', (data: any) => {
    // Met à jour la position de la raquette adverse
    if (data.side === 'left') {
        leftPaddle.setY(data.y);
    } else {
        rightPaddle.setY(data.y);
    }
});
```

**Flux de données :**
1. Joueur 1 appuie sur "W" → sa raquette monte
2. `animate()` détecte le changement → émet `paddle_move`
3. Serveur reçoit `paddle_move` de Joueur 1
4. Serveur émet `opponent_move` à Joueur 2
5. Joueur 2 reçoit `opponent_move` → met à jour la raquette adverse

---

## Étape 8 : Synchronisation de la Balle

### Événement : `ball_update` (lignes 417-428)

```typescript
s.on('ball_update', (data: any) => {
    if (isRemote) {
        // 1. Synchronise la position et vitesse de la balle
        pongBall.syncState(data.ball);
        
        // 2. Met à jour les scores
        leftScore = data.score.left;
        rightScore = data.score.right;
        
        // 3. Met à jour l'affichage HTML
        document.getElementById('score-left').textContent = String(leftScore);
        document.getElementById('score-right').textContent = String(rightScore);
    }
});
```

**Points clés :**
- Le serveur calcule la physique de la balle
- Envoie régulièrement la position aux deux joueurs
- Les scores sont synchronisés en temps réel

### Événement : `goal_scored` (lignes 430-442)

```typescript
s.on('goal_scored', (data: any) => {
    console.log('[DEBUG] Goal Scored!', data);
    
    // 1. Synchronise la balle (réinitialisée au centre)
    pongBall.syncState(data.ball);
    
    // 2. Met à jour les scores
    leftScore = data.score.left;
    rightScore = data.score.right;
    
    // 3. Met à jour l'affichage
    document.getElementById('score-left').textContent = String(leftScore);
    document.getElementById('score-right').textContent = String(rightScore);
    
    // Pas de compte à rebours local
    // Le serveur gère le redémarrage de la balle
});
```

---

## Étape 9 : Fin de Partie

### Événement : `game_over` (lignes 444-470)

```typescript
s.on('game_over', (data: any) => {
    // 1. Marque le jeu comme terminé
    gameOver = true;
    gameStarted = false;
    
    // 2. Met à jour les scores finaux
    if (data.score) {
        leftScore = data.score.left;
        rightScore = data.score.right;
    }
    
    // 3. Détermine le gagnant
    winnerName = data.winner?.username || 
        (leftScore > rightScore ? 'Left Player' : 'Right Player');
    
    // 4. Affiche le message de victoire
    drawWin(winnerName + ' Wins!');
    
    // 5. Affiche le bouton "Return to Lobby"
    document.getElementById('btn-return-lobby').classList.remove('hidden');
    
    // 6. Si c'est un tournoi, envoie le résultat
    if (gameMode === 'tournament') {
        const tSocket = getSocketInstance();
        if (tSocket) {
            const result = {
                gameId: currentGameId,
                winnerId: data.winner?.id,
                loserId: data.players?.find(p => p.id !== data.winner?.id)?.id,
                score: data.score
            };
            tSocket.emit('match:result', result);
        }
    }
});
```

**Points clés :**
- Le serveur décide quand la partie est terminée
- Le gagnant est déterminé par le serveur
- Les boutons Rematch et Return to Lobby apparaissent

---

## Étape 10 : Rejoindre une Partie Existante

### Fonction : `joinMatch()` (lignes 645-656)

Quand un joueur entre un Game ID :

```typescript
async function joinMatch() {
    // 1. Récupère l'ID entré par l'utilisateur
    const input = document.getElementById('join-id') as HTMLInputElement;
    const gameId = input?.value.trim();
    
    if (!gameId) return;  // Ignore si vide
    
    // 2. Affiche la vue du jeu
    showGameView();
    
    // 3. Connecte le socket
    gameSocket.connect();
    
    // 4. Configure les variables
    currentGameId = gameId;
    isRemote = true;
    playerSide = 'right';  // Le joueur qui rejoint est toujours à droite
    
    // 5. Rejoint la partie via WebSocket
    gameSocket.socket.emit('join_game', { 
        gameId, 
        side: 'right' 
    });
}
```

**Séquence :**
1. Joueur 1 crée une partie → reçoit un Game ID
2. Joueur 1 partage l'ID avec Joueur 2
3. Joueur 2 entre l'ID et clique "Join"
4. Joueur 2 rejoint la partie
5. Le serveur émet `game_start` aux deux joueurs

---

## Étape 11 : Gestion des Erreurs

### Événement : `error` (lignes 294-316)

```typescript
s.on('error', (data: any) => {
    console.error('[SOCKET] Error:', data);
    
    // 1. Extrait le message d'erreur
    const message = typeof data === 'string' ? data : 
        (data.message || 'An error occurred');
    
    // 2. Affiche l'erreur à l'utilisateur
    const infoBox = document.getElementById('game-info');
    infoBox.classList.remove('hidden');
    infoBox.innerHTML = `
        <span class="text-red-500">ERROR</span><br>
        <span class="text-sm">${message}</span>
    `;
    
    // 3. Arrête le jeu
    gameOver = true;
    gameStarted = false;
    
    // 4. Affiche le bouton Return to Lobby
    document.getElementById('btn-return-lobby').classList.remove('hidden');
    
    // 5. Retour automatique au lobby après 3 secondes
    setTimeout(() => {
        showLobbyView();
    }, 3000);
});
```

### Événement : `player_left` (lignes 472-484)

```typescript
s.on('player_left', () => {
    // 1. Affiche un message
    const infoBox = document.getElementById('game-info');
    infoBox.classList.remove('hidden');
    infoBox.innerHTML = `
        <span class="text-orange-500">Opponent left the match.</span>
    `;
    
    // 2. Arrête le jeu
    gameStarted = false;
    gameOver = true;
    
    // 3. Affiche le bouton Return to Lobby
    document.getElementById('btn-return-lobby').classList.remove('hidden');
});
```

---

## Étape 12 : Rematch

### Bouton Rematch (lignes 593-631)

```typescript
const btnRematch = document.getElementById('btn-rematch');
btnRematch.onclick = () => {
    console.log('[DEBUG] Rematch button clicked');
    
    if (isRemote && currentGameId) {
        // Mode remote : demande un rematch au serveur
        console.log('[DEBUG] Emitting request_rematch');
        gameSocket.socket.emit('request_rematch', { 
            gameId: currentGameId 
        });
        
        // Feedback visuel : désactive le bouton
        btnRematch.classList.add('opacity-50', 'pointer-events-none');
        btnRematch.textContent = ' Waiting...';
        
        return;
    }
    
    // Mode local : redémarre immédiatement
    document.getElementById('end-game-controls').classList.add('hidden');
    resetLocalState();
    
    const infoBox = document.getElementById('game-info');
    infoBox.classList.remove('hidden');
    infoBox.innerHTML = aiMode ?
        `<span class="text-red-500">Practice vs AI</span>` :
        `<span class="text-yellow-500">Local Multiplayer</span>`;
    setTimeout(() => infoBox.classList.add('hidden'), 3000);
    
    countdown.start(() => {
        gameStarted = true;
        pongBall.start();
    });
};
```

### Événement : `rematch_requested` (lignes 383-390)

```typescript
s.on('rematch_requested', (data: any) => {
    const infoBox = document.getElementById('game-info');
    infoBox.classList.remove('hidden');
    infoBox.innerHTML = `
        <span class="text-orange-400">${data.from}</span> wants a rematch!
    `;
    // Le message reste visible jusqu'au début de la partie
});
```

**Flux du Rematch :**
1. Joueur 1 clique "Rematch" → émet `request_rematch`
2. Serveur reçoit la demande
3. Serveur émet `rematch_requested` à Joueur 2
4. Joueur 2 voit le message et clique "Rematch"
5. Serveur crée une nouvelle partie avec les mêmes joueurs
6. Les deux joueurs reçoivent `game_start` avec scores à 0

---

## Résumé du Flux Complet

### Création d'une Partie

```
Joueur 1 clique "Online Match"
    ↓
startRemoteGame()
    ↓
gameSocket.createGame() → Requête POST /api/game/create
    ↓
Serveur crée une partie et retourne gameId
    ↓
emit('join_game', { gameId, side: 'left' })
    ↓
Serveur émet 'waiting_for_opponent'
    ↓
Joueur 1 voit "Waiting for opponent..." + Game ID
```

### Rejoindre une Partie

```
Joueur 2 entre le Game ID et clique "Join"
    ↓
joinMatch()
    ↓
emit('join_game', { gameId, side: 'right' })
    ↓
Serveur détecte que 2 joueurs sont connectés
    ↓
Serveur émet 'game_start' aux deux joueurs
    ↓
Les deux joueurs voient "Match Started!"
    ↓
Compte à rebours : 3... 2... 1... GO!
    ↓
gameStarted = true
```

### Pendant la Partie

```
Joueur appuie sur une touche
    ↓
handleKeyDown() → myPaddle.moveUp() ou moveDown()
    ↓
animate() détecte le changement de position
    ↓
emit('paddle_move', { gameId, y })
    ↓
Serveur reçoit et transmet à l'adversaire
    ↓
emit('opponent_move', { side, y }) → Adversaire
    ↓
Adversaire met à jour la raquette

Serveur calcule la physique de la balle
    ↓
emit('ball_update', { ball, score }) → Les deux joueurs
    ↓
Les joueurs synchronisent la balle et les scores

Un joueur marque
    ↓
Serveur émet 'goal_scored'
    ↓
Serveur réinitialise la balle après un délai
    ↓
Serveur redémarre la balle

Un joueur atteint le score gagnant
    ↓
Serveur émet 'game_over'
    ↓
Les deux joueurs voient "X Wins!"
    ↓
Boutons Rematch et Return to Lobby apparaissent
```

---

## Variables d'État Importantes

### Variables Globales (main.ts)

```typescript
let currentGameId: string | null = null;  // ID de la partie en cours
let playerSide: 'left' | 'right' = 'left'; // Côté du joueur
let isRemote: boolean = false;             // Mode en ligne ?
let gameStarted: boolean = false;          // Jeu démarré ?
let gameOver: boolean = false;             // Jeu terminé ?
let leftScore: number = 0;                 // Score gauche
let rightScore: number = 0;                // Score droite
let winnerName: string | null = null;      // Nom du gagnant
let gameMode: string | null = null;        // Mode (normal/tournament)
let animationId: number | null = null;     // ID de l'animation
```

### Objets de Jeu

```typescript
let leftPaddle: Paddle;    // Raquette gauche
let rightPaddle: Paddle;   // Raquette droite
let pongBall: PongBall;    // Balle
let countdown: CountDown;  // Compte à rebours
```

---

## Communication WebSocket

### Événements Émis par le Client

| Événement | Données | Description |
|-----------|---------|-------------|
| `join_game` | `{ gameId, side }` | Rejoint une partie |
| `paddle_move` | `{ gameId, y }` | Envoie la position de la raquette |
| `request_rematch` | `{ gameId }` | Demande un rematch |

### Événements Reçus par le Client

| Événement | Données | Description |
|-----------|---------|-------------|
| `waiting_for_opponent` | - | En attente d'un adversaire |
| `game_start` | `{ id, players, score, paddles, ball }` | La partie commence |
| `opponent_move` | `{ side, y }` | Mouvement de l'adversaire |
| `ball_update` | `{ ball, score }` | Mise à jour de la balle |
| `goal_scored` | `{ ball, score }` | Un but a été marqué |
| `game_over` | `{ winner, score, players }` | Fin de partie |
| `player_left` | - | L'adversaire a quitté |
| `error` | `{ message }` | Une erreur s'est produite |
| `rematch_requested` | `{ from }` | Demande de rematch |

---

## Différences : Mode Local vs Mode Remote

### Mode Local (isRemote = false)

- Les deux raquettes sont contrôlées localement
- La physique de la balle est calculée localement
- Pas de communication réseau
- Un seul ordinateur, deux joueurs

### Mode Remote (isRemote = true)

- Chaque joueur contrôle UNE raquette
- Le serveur calcule la physique de la balle
- Communication via WebSocket
- Deux ordinateurs, deux joueurs

---

## Gestion de la Latence

Le jeu utilise plusieurs techniques pour gérer la latence :

1. **Prédiction côté client** : Les raquettes bougent immédiatement
2. **Synchronisation serveur** : Le serveur fait autorité pour la balle
3. **Interpolation** : `pongBall.syncState()` met à jour en douceur
4. **Fréquence de mise à jour** : Le serveur envoie des mises à jour régulières

---

## Sécurité

### Authentification

```typescript
// gameSocket.ts
const token = this.getCookie('token');
this.socket = io('/game', {
    auth: { token: token },  // Token envoyé lors de la connexion
    withCredentials: true
});
```

### Validation côté serveur

- Le serveur vérifie que le joueur appartient bien à la partie
- Les mouvements impossibles sont rejetés
- Les scores sont calculés uniquement par le serveur

---

## Conclusion

Le mode "Online Match" est un système complexe qui coordonne :

1. **Création de partie** via API REST
2. **Communication temps réel** via WebSocket
3. **Synchronisation d'état** entre clients
4. **Physique autoritaire** sur le serveur
5. **Rendu fluide** côté client

Chaque joueur voit une version synchronisée du jeu, avec le serveur comme source de vérité pour la balle et les scores.
