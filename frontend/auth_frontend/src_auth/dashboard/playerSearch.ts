
import axios from "axios";
import { PlayerProfileManager } from "../../../profile_frontend/src/components/FriendRequest";
interface Player {
    id: number;
    name: string;
    email: string;
    display_name: string;
    online_status: string;
}

async function fetchAllUsers(): Promise<Player[]| undefined> {
    try {
    const response = await axios.get('/api/users/getAllUsers', {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    const usersData = response.data.users;
  //  console.log('Fetched users data:', usersData);
    const players: Player[] = [];
    
    
    usersData.forEach((userData: any) => {
      const player: Player = {
        name: userData.username,
        id: userData.id,
        email: userData.email,
        display_name: userData.display_name,
        online_status: userData.online_status
      };
      players.push(player);
    });
    return players;
    // console.log('Players:', players);
  } catch (error) {
    console.error('Error fetching all users:', error);
  }
  
}

class PlayerSearch {
  private searchInput: HTMLInputElement;
  private searchResults: HTMLDivElement;
  private players: Player[] = [];
  private profileManager: PlayerProfileManager;

  constructor(searchInput: HTMLInputElement, searchResults: HTMLDivElement) {
    this.searchInput = searchInput;
    this.searchResults = searchResults;
    
    // Sample player data - replace with your actual data source or API call
    
    this.profileManager = new PlayerProfileManager();
    this.initializeEventListeners();
  }

  public initializeEventListeners(): void {
    this.searchInput.addEventListener('input', (e: Event) => {
      this.handleSearch(e);
    });

    document.addEventListener('click', (e: MouseEvent) => {
      this.handleClickOutside(e);
    });
  }

  private handleSearch(e: Event): void {
    const target = e.target as HTMLInputElement;
    const query = target.value.toLowerCase().trim();

    if (query.length === 0) {
      this.hideResults();
      return;
    }

    const filteredPlayers = this.filterPlayers(query);
    this.displayResults(filteredPlayers);
  }

  private filterPlayers(query: string): Player[] {
    return this.players.filter(player =>
      player.name.toLowerCase().includes(query)
    );
  }

  private displayResults(filteredPlayers: Player[]): void {
    if (filteredPlayers.length > 0) {
      this.searchResults.innerHTML = filteredPlayers
        .map(player => this.createPlayerResultHTML(player))
        .join('');
      this.showResults();
    } else {
      this.searchResults.innerHTML = this.createNoResultsHTML();
      this.showResults();
    }
  }

  private createPlayerResultHTML(player: Player): string {
    return `
      <button class="w-full text-left px-4 py-3 text-white/90 
                     hover:bg-white/5 transition-all duration-200 
                     flex items-center justify-between gap-3
                     border-b border-white/5 last:border-b-0
                     first:rounded-t-xl last:rounded-b-xl"
              data-player-id="${player.id}">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-white/50 text-[20px]">person</span>
          <span class="font-medium">${this.escapeHtml(player.name)}</span>
        </div>
        <span class="text-sm text-white/40">#${player.display_name}</span>
      </button>
    `;
  }

  private createNoResultsHTML(): string {
    return `
      <div class="px-4 py-6 text-white/40 text-center text-sm">
        No players found
      </div>
    `;
  }

  private handleClickOutside(e: MouseEvent): void {
    const target = e.target as Node;
    if (!this.searchInput.contains(target) && !this.searchResults.contains(target)) {
      this.hideResults();
    }
  }

  private showResults(): void {
    this.searchResults.classList.remove('hidden');
  
    const resultButtons = this.searchResults.querySelectorAll('[data-player-id]');
    resultButtons.forEach(button => {
      button.addEventListener('click', (e: Event) => {
        const playerId = (e.currentTarget as HTMLElement).dataset.playerId;
        if (playerId) {
          this.selectPlayer(parseInt(playerId));
        }
      });
    });
  }

  private hideResults(): void {
    this.searchResults.classList.add('hidden');
  }

  private async selectPlayer(playerId: number): Promise<void> {
    console.log('Selected player:', playerId);
  const selectedPlayer = this.players.find(p => p.id === playerId);
  
  if (selectedPlayer) {
    console.log('Selected player details:', selectedPlayer);
    await this.profileManager.showPlayerProfile(selectedPlayer.id);
  }
  
  this.searchResults.classList.add('hidden');
  this.searchInput.value = '';
};

  

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  
  public updatePlayers(players: Player[]): void {
    this.players = players;
  }

  public async loadPlayersFromAPI(): Promise<void> {
    try {
      const response = await fetchAllUsers();
      const data: Player[] = response || [];
      this.updatePlayers(data);
    } catch (error) {
      console.error('Error loading players:', error);
    }
  }
}

// Initialize the search when DOM is ready
// document.addEventListener('DOMContentLoaded', () => {
//   const playerSearch = new PlayerSearch();
  
  // Optional: Load players from API
  // playerSearch.loadPlayersFromAPI('/api/players');
// });

export { PlayerSearch };
export type { Player };