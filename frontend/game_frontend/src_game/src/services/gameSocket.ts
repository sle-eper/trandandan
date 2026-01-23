import { io, Socket } from 'socket.io-client';

class GameSocketService {
    public socket: Socket;
    public userData: any = null;

    constructor() {
        // Since we are behind Nginx on the same host, we connect to the current origin
        // The path /socket.io is handled by the gateway
        const token = this.getCookie('token'); // Assuming token is in a cookie

        this.socket = io('/game', {
            path: '/game-socket/',
            auth: { token: token },
            autoConnect: false,
            transports: ['websocket'],
            withCredentials: true
        });

        this.socket.on('connect', () => {
            console.log('Game Socket Connected:', this.socket.id);
        });

        this.socket.on('user_info', (user: any) => {
            console.log('User info received:', user);
            this.userData = user;
        });

        this.socket.on('connect_error', (err) => {
            console.error('Game Socket Connection Error:', err.message);
        });

        this.socket.on('disconnect', () => {
            console.log('Game Socket Disconnected');
        });

        // Game invites are handled by the main app, not here
        // This prevents unwanted tab opening/navigation
        /*
        this.socket.on('game_invite', (data: any) => {
            console.log('Received Game Invite:', data);
            if (confirm(`Game Invite from ${data.from}. Accept?`)) {
                window.location.href = `/game?gameId=${data.gameId}`;
            }
        });
        */
    }

    private getCookie(name: string): string | null {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        // Fallback to localStorage token for clients that store token there
        try {
            const ls = localStorage.getItem(name);
            if (ls) return ls;
        } catch (e) {
            // ignore (e.g., localStorage not available)
        }
        return null;
    }

    public connect() {
        if (!this.socket.connected) {
            // Refresh token before connecting if needed
            this.socket.auth = { token: this.getCookie('token') };
            this.socket.connect();
        }
    }

    public disconnect() {
        if (this.socket.connected) {
            this.socket.disconnect();
        }
    }

    public async createGame(): Promise<string | null> {
        try {
            const token = this.getCookie('token');
            const headers: any = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch('/api/game/create', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({}),
                // This is crucial: it tells the browser to send cookies (like the 'token')
                credentials: 'include'
            });

            if (!response.ok) {
                console.error(`Game creation failed with status: ${response.status}`);
                return null;
            }

            const data = await response.json();
            return data.gameId;
        } catch (err) {
            console.error('Network error during game creation:', err);
            return null;
        }
    }
}

export const gameSocket = new GameSocketService();
