import axios from 'axios';
import { db } from './db/database';
// Configuration
const USER_MANAGEMENT_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-management:3000';

// Service function to fetch user data
async function fetchUserData(userId: string) {
  console.log("Fetching data for user ID:", userId);
  try {
    const response = await axios.get(`${USER_MANAGEMENT_SERVICE_URL}/user/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 5000 
    });
    console.log("Fetched user data:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Failed to fetch user data: ${error.message}`);
      throw new Error(`User service unavailable: ${error.response?.status || 'unknown'}`);
    }
    throw error;
  }
}

async function getFriendsOfUser(userId: string) {
  try {
    const response = await axios.get(`${USER_MANAGEMENT_SERVICE_URL}/${userId}/friends`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 5000 
    });
    
    const friends = response.data.friends;
    
    if (friends.length === 0) {
        return [];
    }
    
    const friendIds = friends.map((friend: any) => friend.id);
    const placeholders = friendIds.map(() => '?').join(',');
    
    const currentUserId = parseInt(userId); 

    const latestMessages = db.prepare(`
        SELECT 
            CASE 
                WHEN send = ? THEN recv
                ELSE send
            END AS friend_id,
            msg,
            send,
            recv,
            status,
            send_at, 
            strftime('%H:%M', send_at) AS send_at_formatted
        FROM msg
        WHERE id IN (
            SELECT MAX(id)
            FROM msg
            WHERE 
                (send = ? AND recv IN (${placeholders}))
                OR 
                (recv = ? AND send IN (${placeholders}))
            GROUP BY 
                CASE 
                    WHEN send = ? THEN recv
                    ELSE send
                END
        )
        ORDER BY send_at DESC
    `).all(currentUserId, currentUserId, ...friendIds, currentUserId, ...friendIds, currentUserId);
    

    const messageMap = new Map();
    latestMessages.forEach((m: any) => {
        messageMap.set(m.friend_id, m);
    });

    const result = friends.map((friend: any) => {
        const msg = messageMap.get(friend.id); 
        return {
            ...friend,
            msg: msg?.msg || null,
            send: msg?.send || null,
            recv: msg?.recv || null,
            msg_status: msg?.status || null,
            last_message_time: msg?.send_at || null, 
            display_time: msg?.send_at_formatted || null
        };
    });

    result.sort((a: any, b: any) => {
        if (!a.last_message_time && !b.last_message_time) return 0;
        if (!a.last_message_time) return 1;
        if (!b.last_message_time) return -1;
        
        return new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime();
    });

    return result;

  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error(`Failed to fetch friends data: ${error.message}`);
      throw new Error(`User service unavailable: ${error.response?.status || 'unknown'}`);
    }
    throw error;
  }
}
async function getStatusOfTowFriends(userId:string,friendId:string):Promise<object> {
  // console.log("Getting friendship status between", userId, "and", friendId);
  try {
    const res = await axios.get(`${USER_MANAGEMENT_SERVICE_URL}/friendship/status/${userId}/${friendId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 5000 
    });
    if (!res.data || !res.data.status1 || !res.data.status2) {
      throw new Error("Invalid friendship response");
    }
    // console.log("res.data", res.data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Failed to fetch friendship status: ${error.message}`);
      throw new Error(`User service unavailable: ${error.response?.status || 'unknown'}`);
    }
    throw error;
  }
}

async function changeStatusOfFriends(status:string,userId:string,friendId:string):Promise<object> {
  try {
    const response = await axios.put(`${USER_MANAGEMENT_SERVICE_URL}/friends/${userId}/status`, {
      status,
      friendId
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 5000 
    });
    // console.log("froom",response.data)
    // return response.data;
    return getStatusOfTowFriends(userId,friendId)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Failed to change friendship status: ${error.message}`);
      throw new Error(`User service unavailable: ${error.response?.status || 'unknown'}`);
    }
    throw error;
  }
}


async function updateUserStat( userId: string, status: string) {
  console.log("Updating status for user ID:", userId, "to status:", status);
  try {
     const response = await axios.put(`${USER_MANAGEMENT_SERVICE_URL}/user/${userId}/status`, {
      status
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 5000 
    });
    // console.log("User status updated successfully:", response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Failed to update user status: ${error.message}`);
      throw new Error(`User service unavailable: ${error.response?.status || 'unknown'}`);
    }
    throw error;
  }
}


export { fetchUserData , getFriendsOfUser , getStatusOfTowFriends , changeStatusOfFriends , updateUserStat };