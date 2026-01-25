import axios from "axios";


interface Player {
  id: number;
  name: string;
  email: string;
  display_name: string;
  online_status: string | boolean;
  avatar?: string;
  bio?: string;
  matches_played?: number;
  wins?: number;
  losses?: number;
  best_score?: number;
  joined_date?: string;
}

// Fetch player profile with all data
export class PlayerFriendship {

 static async fetchPlayerProfile(playerId?: number): Promise<Player | null> {
  console.log('Fetching profile for player ID:', playerId);
  try {
    const response = await axios.get(`/api/users/profile`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      params: { id : playerId }
    });
    
    if (response && response.data) {
      const userObj = response.data.profile;
      console.log('Player profile fetched successfully', response.data);
      return {
        id: userObj.id,
        name: userObj.username,
        email: userObj.email,
        display_name: userObj.display_name || '',
        online_status: userObj.online_status ?? false,
        avatar: userObj.avatar_url,
        bio: userObj.bio || '',
        matches_played: userObj.total_games || 0,
        wins: userObj.wins || 0,
        losses: userObj.losses || 0,
        joined_date: userObj.created_at || '',
        best_score: userObj.best_score || 0,
      };
    }
  } catch (error) {
    console.error('Error fetching player profile:', error);
    return null;
  }
  return null;
};

// Check friendship status
  static async checkFriendshipStatus(friendId: number): Promise<boolean>   {
  try {
   
        const response = await axios.get('/api/users/friend/check', {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
        params: { friendId }
        });
            if (response && response.data) {
                console.log('Friendship status fetched successfully', response.data);
                if(response.data.areFriends) {
                return true;
            }
        }   
    } catch (error) {
        console.error('Error checking friendship status:', error);
    }
    return false;
};

    // Check if request is pending
    static async checkPendingRequest(friendId: number): Promise<boolean> {
    try {
    const pendingResponse = await axios.get('/api/users/friend/requestStatus', {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      params: { friendId }
    });
    
    if (pendingResponse && pendingResponse.data && pendingResponse.data.isPending) {
       console.log('Friend request is pending' , pendingResponse.data.isPending);
        return true;
    }
    }catch (error) {
        console.error('Error checking pending request status:', error);
    }
    return false;
    };
}
    
export type { Player };

