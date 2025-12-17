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
            const response = await axios.get('http://localhost:3001/user/14', {
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
        const response = await axios.put('http://localhost:3001/profile/14/update', profile, {
           
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
  static async updateAvatar(formData: FormData): Promise<string | null> {
        try {
            const response =  await axios.post('http://localhost:3001/profile/14/avatar', formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
            // headers: {
            //   'Authorization': `Bearer ${yourToken}`
            // }
        });
        console.log('Avatar upload response:', response);
        if (response.status === 200 && response.data.avatarUrl) {
            console.log('Avatar URL:', response.data.avatarUrl);
            return response.data.avatarUrl; // Returns: /uploads/avatars/avatar_1_12345.jpg
        }

        return null;
        } catch (error) {
             console.error('Avatar upload failed:', error);
        return null;
        }
    }
}
export default User;
export type { UserProfile };