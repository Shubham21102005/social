const User = require('../models/User');
const jwt= require('jsonwebtoken');
require('dotenv').config();


const signupUser= async (req,res)=>{
    try{
        const {username,email,password} = req.body;
        const existingUser= await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:`User with this email already exists`});
        }

        const newUser= new User({
            username,
            email,
            password
        })

        await newUser.save()
        // Remove password before sending response
        const userToReturn = { ...newUser._doc };
        delete userToReturn.password;
    
        res.status(201).json({ message: 'Signup successful', user: userToReturn });
    }catch(error){
        res.status(500).json({message: `Failed to SignUp`})
    }
}

const loginUser= async (req,res)=>{
    try{
        const {email,password}= req.body;
        const existingUser= await User.findOne({email});
        if(!existingUser){
            return res.status(404).json({message:`No Such User exists`})
        }

        const isMatch= await existingUser.comparePassword(password);

        if(!isMatch){
            return res.status(400).json({message:`Incorrect Password`})
        }
        const userToReturn = { ...existingUser._doc };
        delete userToReturn.password;

        const token = jwt.sign(
            { id: existingUser._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1d' }  // token expires in 1 day
          );
    
        res.status(200).json({ message: 'Login successful',token, user: userToReturn });
        


    }catch(error){
        res.status(500).json({message: `Failed to Login`})
    }
}


module.exports= {signupUser,loginUser};
