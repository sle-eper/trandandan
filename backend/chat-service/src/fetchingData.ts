import axios from 'axios';
import { db } from './db/database';
import { log } from 'console';
// Configuration
const USER_MANAGEMENT_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-management:3000';

// Service function to fetch user data
async function fetchUserData(userId: string) {
  try {
    const response = await axios.get(`${USER_MANAGEMENT_SERVICE_URL}/user/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 5000 
    });
    
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
    // console.log("friends fetched:", friends);
    if (friends.length === 0) {
        return [];
    }
    const friendIds = friends.map((friend: any) => friend.id);
    const placeholders = friendIds.map(() => '?').join(',');
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
            strftime('%H:%M', send_at) AS send_at
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
    `).all(userId, userId, ...friendIds, userId, ...friendIds, userId);
    const messageMap = new Map();
    latestMessages.forEach((m: { friend_id: string | number; }) => {
    messageMap.set(m.friend_id, m);
    });


    const result = friends.map((friend: { id: any; }) => {
    const msg = messageMap.get(friend.id);
    return {
      ...friend,  // All friend data (id, username, avatar_url, etc.)
      msg: msg?.msg || null,
      send: msg?.send || null,
      recv: msg?.recv || null,
      msg_status: msg?.status || null,
      send_at: msg?.send_at || null
    };
  });
  return result;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Failed to fetch friends data: ${error.message}`);
      throw new Error(`User service unavailable: ${error.response?.status || 'unknown'}`);
    }
    throw error;
  }
}

// async function getFriendsOfUser(userId: string) {
//   try {
//     const response = await axios.get(`${USER_MANAGEMENT_SERVICE_URL}/${userId}/friends`, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       },
//       timeout: 5000 
//     });
    
//     const friends = response.data.friends;
//     if (friends.length === 0) return [];

//     const friendIds = friends.map((f: any) => f.id);
//     const placeholders = friendIds.map(() => '?').join(',');

//     const latestMessages = db.prepare(`
//         SELECT 
//             CASE 
//                 WHEN send = ? THEN recv
//                 ELSE send
//             END AS friend_id,
//             msg,
//             send,
//             recv,
//             status,
//             strftime('%H:%M', send_at) AS send_at
//         FROM msg
//         WHERE id IN (
//             SELECT MAX(id)
//             FROM msg
//             WHERE 
//                 (send = ? AND recv IN (${placeholders}))
//                 OR 
//                 (recv = ? AND send IN (${placeholders}))
//             GROUP BY 
//                 CASE 
//                     WHEN send = ? THEN recv
//                     ELSE send
//                 END
//         )
//     `).all(
//         userId,          // CASE WHEN send = ? THEN recv
//         userId,          // send = ?
//         ...friendIds,    // recv IN (...)
//         userId,          // recv = ?
//         ...friendIds,    // send IN (...)
//         userId           // CASE WHEN send = ? THEN recv
//     );
//     // console.log(merged)
//     // 1. Create map friend_id → message
//     const messageMap = new Map();
//     latestMessages.forEach((m: any) => messageMap.set(String(m.friend_id), m));

//     // 2. Combine friends + last message in one array
//     const merged = friends.map((friend: any) => ({
//       ...friend,
//       lastMessage: messageMap.get(String(friend.id)) || null,
//       sortTime: messageMap.get(String(friend.id))?.real_time || 0
//     }));

//     // 3. Sort by latest message time desc
//     merged.sort((a, b) => (b.sortTime > a.sortTime ? 1 : -1));
//     // console.log(merged)
//     return merged;

//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }


async function getStatusOfTowFriends(userId:string,friendId:string):Promise<object> {
  try {
    const res = await axios.get(`${USER_MANAGEMENT_SERVICE_URL}/friendship/status/${userId}/${friendId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 5000 
    });
    // console.log(res)
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
    console.log("froom",response.data)
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


export { fetchUserData , getFriendsOfUser , getStatusOfTowFriends , changeStatusOfFriends };