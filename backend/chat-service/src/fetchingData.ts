import axios from 'axios';

// Configuration
const USER_MANAGEMENT_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-management:3000';

// Service function to fetch user data
 async function fetchUserData(userId: string) {
  try {
    const response = await axios.get(`${USER_MANAGEMENT_SERVICE_URL}/profile/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        // Include service-to-service auth if needed
        'X-Service-Auth': process.env.SERVICE_SECRET
      },
      timeout: 5000 // 5 second timeout
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

export { fetchUserData };