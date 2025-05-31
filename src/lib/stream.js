import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) throw new Error("Missing Stream API key or secret");

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        const userDataWithRole = {
            ...userData,
            role: 'user',
            permissions: ['ReadChannel']
        };

        await streamClient.upsertUser(userDataWithRole);
        await streamClient.updateUserRoles({
            userId: userData._id.toString(),
            roles: ['user'],
            channelRole: 'channel_member',
            channelType: 'messaging'
        });
        return userDataWithRole;
    } catch (error) {
        console.log("error upserting user", error);
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
