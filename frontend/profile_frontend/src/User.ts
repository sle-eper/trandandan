 interface UserProfile  {
    username: string;
    email: string;
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    onlineStatus?: boolean;
}


export class User {
    static async fetchUserProfile(): Promise<UserProfile | null> {

        try {
            const response = await fetch('/api/users/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
        }
            });
            if(response.ok) {
                console.log('User profile fetched successfully', response);
                const data: UserProfile = await response.json();
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