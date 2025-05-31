import express from "express"
import { login, logout, signup, onboard } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router()

// This route handles user signup

router.get("/me",protectRoute, (req, res) => {
  // This route is used to get the authenticated user's details
  res.status(200).json({ user: req.user });
});

router.post("/signup",signup);


router.post("/login", login);

router.post("/logout", logout);

router.post("/onboarding",protectRoute ,onboard)


export default router
