 interface UserProfile  {
    id?: number;
    username: string;
    email: string;
    displayName: string;
    bio: string;
    avatarUrl: string;
    onlineStatus: string;
}

import axios from "axios";

export class User {
    static async fetchUserProfile(): Promise<UserProfile | null> {

        try {
            const response = await axios.get('http://localhost:8080/api/users/User', {
    
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            if (response && response.data) {
                console.log('User profile fetched successfully', response);
                const userObj = response.data.user;

        
                return {
                id: userObj.id,
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

    static async saveUserProfile(profile: Partial<UserProfile>): Promise<boolean> {
        try {
        const response = await axios.put('http://localhost:8080/api/users/profile/update', profile, {
           
            headers: {
            'Content-Type': 'application/json',
            }
            ,withCredentials: true
        });
        return response.status === 200;
        } catch (error) {
        console.error('Failed to save profile:', error);
        return false;
        }
    }
  static async updateAvatar(formData: FormData): Promise<string | null> {
        try {
            const response =  await axios.post('http://localhost:8080/api/users/profile/avatar', formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
            withCredentials: true
        });
        console.log('Avatar upload response:', response);
        if (response.status === 200 && response.data.avatarUrl) {
            console.log('Avatar URL:', response.data.avatarUrl);
            return response.data.avatarUrl; // Return the new avatar URL
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