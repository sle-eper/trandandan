 interface UserProfile  {
    username: string;
    email: string;
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    onlineStatus?: boolean;
}

import axios from "axios";
export class User {
    static async fetchUserProfile(): Promise<UserProfile | null> {

        try {
            const response = await axios.get<UserProfile>('http://localhost:3001/user/13', {
                // credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response && response.data) {
                console.log('User profile fetched successfully', response);
                const data: UserProfile = response.data;
                console.log('Fetched user data:', data);
                return data;
            }
        }catch (error) {
                console.error('Error fetching user profile:', error);
                return null;
            }

            return null;
        }

    static async saveUserProfile(profile: UserProfile): Promise<boolean> {
        try {
        const response = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(profile)
        });
        return response.ok;
    } catch (error) {
      console.error('Failed to save profile:', error);
      return false;
    }
  }
}
export default User;
export type { UserProfile };