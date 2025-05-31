import express from "express" ;
import { protectRoute } from "../middleware/auth.middleware.js";
import { getRecommendedUsers, getMyFriends , sendFriendRequest, acceptFriendRequest, getFriendRequests, getOutgoingFriendReqs, searchUsers} from "../controller/user.controller.js";
import { send } from "process";

const router = express.Router()

router.use(protectRoute)
router.get("/", getRecommendedUsers);

router.get("/friends", getMyFriends);
router.post("/friend-request/:id", sendFriendRequest)

router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);
router.get("/search", searchUsers);


export default router

