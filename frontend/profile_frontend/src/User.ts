 interface UserProfile  {
    username: string;
    email: string;
    displayName: string;
    bio: string;
    avatarUrl: string;
    onlineStatus: boolean;
}

import axios from "axios";
export class User {
    static async fetchUserProfile(): Promise<UserProfile | null> {

        try {
            const response = await axios.get('http://localhost:3001/user/13', {
                // credentials: 'include',
                //  withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response && response.data) {
                console.log('User profile fetched successfully', response);
                const userObj = response.data.user;

        
                return {
                username: userObj.username,
                email: userObj.email,
                displayName: userObj.display_name  || '',
                bio: userObj.bio || '',
                avatarUrl: userObj.avatar_url ,
                onlineStatus: userObj.online_status  ?? false
                };
            }
        }catch (error) {
                console.error('Error fetching user profile:', error);
                return null;
            }

            return null;
        }

    static async saveUserProfile(profile: UserProfile): Promise<boolean> {
        try {
        const response = await axios.put('http://localhost:3001/profile/13/update', profile, {
           
            headers: {
            'Content-Type': 'application/json',
            }
        });
        return response.status === 200;
    } catch (error) {
      console.error('Failed to save profile:', error);
      return false;
    }
  }
}
export default User;
export type { UserProfile };