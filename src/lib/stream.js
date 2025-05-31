import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) throw new Error("Missing Stream API key or secret");

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    // Extract user ID safely
    const userId = userData._id?.toString() || userData.id?.toString();
    if (!userId) {
      throw new Error('User ID is missing in upsertStreamUser');
    }

    // Prepare user info with role
    const userToUpsert = {
      id: userId,
      name: userData.name || userData.fullName || '',
      image: userData.image || userData.profilePic || '',
      email: userData.email || '',
      role: 'user', // or 'admin' if you want
    };

    // Upsert the user
    await streamClient.upsertUser(userToUpsert);

    return userToUpsert;
  } catch (error) {
    console.log('error upserting user', error);
    throw error;
  }
};

export const generateStreamToken = (id) => {
  try {
    return streamClient.createToken(id.toString());
  } catch (error) {
    console.error("error generating stream token", error);
    throw error;
  }
};
