"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUserData = fetchUserData;
const axios_1 = __importDefault(require("axios"));
// Configuration
const USER_MANAGEMENT_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-management:3000';
// Service function to fetch user data
async function fetchUserData(userId) {
    try {
        const response = await axios_1.default.get(`${USER_MANAGEMENT_SERVICE_URL}/profile/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                // Include service-to-service auth if needed
                'X-Service-Auth': process.env.SERVICE_SECRET
            },
            timeout: 5000 // 5 second timeout
        });
        return response.data;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error(`Failed to fetch user data: ${error.message}`);
            throw new Error(`User service unavailable: ${error.response?.status || 'unknown'}`);
        }
        throw error;
    }
}
