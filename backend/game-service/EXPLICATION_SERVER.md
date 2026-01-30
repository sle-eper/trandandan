# Documentation Détaillée : `server.js` du Game Service

Ce document explique en détail le fonctionnement du fichier `backend/game-service/src/server.js`, qui est le moteur de jeu multijoueur en temps réel de l'application.

---

## 1. Vue d'Ensemble
Le service de jeu est une application **Node.js** utilisant le framework **Fastify** et la bibliothèque **Socket.io**. Son rôle principal est d'agir comme un **serveur faisant autorité (Authoritative Server)** : c'est lui qui calcule le mouvement de la balle, gère les scores et valide les actions des joueurs pour éviter la triche et assurer la synchronisation.

---

## 2. Configuration et Dépendances
Le fichier commence par importer les outils nécessaires :
- **Fastify & Socket.io** : Pour les communications HTTP (REST) et temps réel (WebSockets).
- **JWT (jsonwebtoken)** : Pour vérifier l'identité des utilisateurs via des tokens de session.
- **Axios** : Pour communiquer avec d'autres microservices (comme l'enregistrement des résultats).

### Variables de Configuration
- `CANVAS_WIDTH/HEIGHT` : Définit la taille du terrain (800x400), identique au frontend.
- `TICK_RATE` (16ms) : Le serveur calcule l'état du jeu environ 60 fois par seconde.
- `BALL_SPEED` & `PADDLE_HEIGHT` : Paramètres physiques du jeu.

---

## 3. Gestion de l'État (In-Memory)
Le serveur stocke les données en mémoire vive (RAM) pour une performance maximale :
- `games` (Map) : Stocke les objets de jeu (`gameId` -> score, positions, joueurs).
- `userSockets` (Map) : Lie un ID utilisateur à sa connexion active (Socket ID).
- `gameIntervals` (Map) : Gère les boucles `setInterval` qui font bouger la balle pour chaque partie.

---

## 4. Authentification de Sécurité
La fonction `getUserFromRequest` est le garde-barrière. Elle supporte deux modes :
1. **Headers Nginx** : Si un proxy inverse a déjà validé l'utilisateur (Headers `x-user-id`).
2. **Token JWT** : Extrait du cookie ou du header `Authorization`, puis vérifié avec `JWT_SECRET`.

---

## 5. API REST (Endpoints)
- **`POST /api/game/create`** : Génère un code de partie unique (ex: `a7b2c9`) et initialise une structure de données vide.
- **`POST /api/game/invite`** : Envoie un événement socket "game_invite" à un utilisateur spécifique pour le défier.
- **`GET /api/game/status/:gameId`** : Permet de consulter l'état d'un match (score, statut).

---

## 6. Communication Temps Réel (Socket.io)
Le serveur utilise le namespace `/game`. Les événements clés sont :

- **`join_game`** :
    - Un joueur rejoint une salle (room).
    - Le serveur lui attribue un côté (`left` ou `right`).
    - Si 2 joueurs sont présents, le statut passe à `playing` et le compte à rebours commence.
- **`paddle_move`** : Reçoit la position verticale de la raquette d'un joueur et la diffuse à l'autre.
- **`disconnect`** : Si un joueur quitte, le serveur arrête la partie et attribue une victoire par forfait (3-0) à celui qui reste.
- **`request_rematch`** : Permet aux deux joueurs de réinitialiser le score et de recommencer une partie sans changer de salle.

---

## 7. Le Moteur de Physique (Authoritative Logic)
C'est la partie la plus complexe (`updateGamePhysics`). Contrairement à un jeu local, ici le serveur calcule tout :

1. **Mouvement** : `ball.x += ball.dx`.
2. **Rebonds** : Détecte les murs haut/bas et inverse la vitesse Y.
3. **Collisions Raquettes** :
    - Vérifie si la balle touche une raquette.
    - Ajoute un **effet de "spin"** : si on touche le bord de la raquette, la balle part plus en diagonale.
    - Accélère légèrement la balle à chaque rebond pour augmenter la difficulté.
4. **Scoring** :
    - Si la balle sort par la gauche ou la droite, un point est marqué.
    - Le premier à **5 points** gagne.
    - Envoie `goal_scored` pour notifier les clients.

---

## 8. Finalisation et Persistence
Une fois qu'un gagnant est déclaré :
1. Le serveur appelle `saveMatchResult`.
2. Une requête est envoyée au service **User Management** (via Axios) pour enregistrer de manière permanente qui a gagné, qui a perdu, et les scores.
3. Le serveur conserve la partie en mémoire pendant 60 secondes (pour permettre une revanche) avant de la supprimer.

---

## 9. Pourquoi ce design ?
- **Sécurité** : Un joueur ne peut pas modifier la position de la balle chez lui pour marquer. Seul le serveur décide du score.
- **Simplicité** : Le frontend n'est qu'un "afficheur" (dumb renderer) qui montre ce que le serveur lui dit.
- **Microservices** : Le jeu est indépendant de la gestion des utilisateurs, communiquant par API REST pour les données persistantes.
