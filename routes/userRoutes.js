const express = require('express')
const router = express.Router()
const User = require('./../models/user');
const {jwtAuthMiddleware,generateToken} = require('./../jwt');
 

//signup
router.post('/signup', async(req, res) =>{
    try{
        const data = req.body//assuming the req body contains the data
        //create new user document through mongoose model
        const newUser = new User(data);
        //save the new data to the database
        const response = await newUser.save();
        console.log('data saved');

        const payload = {
            id: response.id
        }
        console.log(JSON.stringify(payload))
        const token = generateToken(payload)
        console.log('Token is:' , token)
        res.status(200).json({response: response, token: token})
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'internal error'})
    }
})

//Login route
router.post('/login',async(req,res) =>{
  try{
    //extract aadharNumber  and password from req body
    const {aadharNumber,password} = req.body;


    //find the user by aadharNumber
    const user = await User.findOne({aadharNumber:aadharNumber});

    //if user does not exit or password does not match, return error
    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({error: 'Invalid username or password'})
    }
    //generate token
    const payload = {
      id: user.id,
    }
    const token = generateToken(payload);

    //return token as response
    res.json({token})
  }catch(err){
    console.error(err);
    res.status(500).json({error: 'internal server error'});

  }
})

//profile routes
router.get('/profile', jwtAuthMiddleware,async (req,res) =>{
  try{
    const userData = req.user;
    const userId = userData.id;
    const user = await Person.findById(userId);
    res.status(200).json(user);
  }catch(err){
    console.error(err);
    res.status(500).json({error: 'invalid server error'});
  }
})

//update the record
router.put('/profile/password', async(req,res) =>{
    try{
        const userID = req.user.id; //extract the  from the token
        const {currentPassword,newPassword} = req.body; //extract new and current password from req body

        const user = await Person.findById(userID);
        if(!(await user.comparePassword(currentPassword))){
            return res.status(404).json({error:' Invalid user or password' });
        }

        //update the user password
        user.password = newPassword;
        await user.save()

        console.log('password updated');
        res.status(200).json({message: 'password updated'});
    }catch(err){
        console.log(err);
        res.status(500).json({error:'internal error'});
    }
})

module.exports = router;