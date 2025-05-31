import User from "../models/User.js"
import jwt from "jsonwebtoken"
import { upsertStreamUser } from "../lib/stream.js";



export async function signup(req,res){
   const {email,password , fullName} = req.body ;
   try {
    if(!email || !password || !fullName){
        return res.status(400).json({message:"All fields are required"})
    }
    if(password.length < 6){
        return res.status(400).json({message:"Password must be at least 6 characters long"})
    }
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if(!emailRegex.test(email)){
    return res.status(400).json({message:"Invalid email format"})
}
const existingUser = await User.findOne({email});
if(existingUser){
    return res.status(400).json({message:"User already exists"})
}
    
const idx = Math.floor(Math.random()*100)+1;
const randomAvatar = `https://robohash.org/${idx}.png`;

const newUser = await  User.create({
    email,
    fullName,
    password,
    profilePic:randomAvatar

})

try {
    await upsertStreamUser({id:newUser._id.toString(),name:newUser.fullName,image:newUser.profilePic || "",email:newUser.email});
    console.log(`Stream user created for : ${newUser.fullName}`);
} catch (error) {
    console.log("error creating stream user", error);
}

const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET,{expiresIn:"7d"});
res.cookie('accessToken', token, {
  httpOnly: true,
  secure: true, // use false for local testing (http)
  sameSite: 'None', // 'Strict' for same origin, 'None' for cross-site (needed for frontend on different domain)
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});


   } catch (error) {
    console.log(error);
    res.status(500).json({message:"Internal server error", })
   }
};

export async  function login(req,res){
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message:"Invalid email "})
        }
        const isPasswordCorrect = await user.comparePassword(password);
        if(!isPasswordCorrect){
            return res.status(401).json({message:"Invalid password"})
        }
        
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
        await user.save();
        res.cookie("token",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"None"});
        res.status(200).json({ success : true ,user ,});
                
           
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error", })
    }
};

export function logout(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        path: "/",
    });
    res.status(200).json({ success: true });
}


export async function onboard(req,res){
    try {
        const userId = req.user._id; 
        const {fullName,bio,nativeLanguage,learningLanguage,location} = req.body;
        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({message:"All fields are required",})
        }
        const updatedUser = await User.findByIdAndUpdate(userId,{...req.body,
            isOnBoarded:true
        },{new:true});
if(!updatedUser){
    return res.status(400).json({message:"User not found"})
}

try {
    await upsertStreamUser({
    id:updatedUser._id.toString(),
    name:updatedUser.fullName,
    image:updatedUser.profilePic || "",
    email:updatedUser.email
})
console.log(`Stream user updated for : ${updatedUser.fullName}`);
} catch (error) {
    console.log("error updating stream user", error);
}

res.status(200).json({success : true ,user : updatedUser});

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error", })
    }
};
