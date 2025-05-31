import { generateStreamToken } from "../lib/stream.js";

async function getStreamToken(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const token = await generateStreamToken(req.user.id);
    if (!token) {
      return res.status(500).json({ message: "Failed to generate Stream token" });
    }

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error in getStreamToken controller:", error);
    res.status(500).json({ 
      message: "Failed to generate Stream token",
      error: error.message 
    });
  }
}

export { getStreamToken };