const express = require('express')
const router = express.Router()
const {jwtAuthMiddleware,generateToken} = require('./../jwt');
const Candidate = require('./../models/candidate');
const User = require('./../models/user');

//check admin role
const checkAdminRole = async (userID) =>{
    try{
        const user = await User.findById(userID);
        if(user.role === 'admin'){
            return true;
        }
            
    }catch(err){
        return false;
    }
}
//post route to add a candidate
router.post('/', jwtAuthMiddleware,async(req, res) =>{
    try{
        if(! await checkAdminRole(req.user.id))
            return res.status(403).json({message: 'user does not have admin role'})
        const data = req.body//assuming the req body contains the data
        //create new user document through mongoose model
        const newCandidate = new Candidate(data);
        //save the new data to the database
        const response = await newCandidate.save();
        console.log('data saved');

        
        res.status(200).json({response: response})
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'internal error'})
    }
})

//update the record
router.put('/:candidateID',jwtAuthMiddleware, async(req,res) =>{
    try{
        if(! await checkAdminRole(req.user.id))
            return res.status(403).json({message: 'user does not have admin role'})
        const candidateID = req.params.candidateID; //extract the id from the url parameter
        const updatedCandidateData = req.body; //updated data for the person

        const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidateData,{
            new : true, //return the updated document
            runValidators: true, // run mongoose validation
        })

        if(!response){
            return res.status(403).json({error:'candidate not found' });
        }

        console.log('data updated');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error:'internal error'});
    }
})

//delete
router.delete('/:candidateID', jwtAuthMiddleware,async(req,res) =>{
    try{
        if(! await checkAdminRole(req.user.id))
            return res.status(403).json({message: 'user does not have admin role'})
        const candidateID = req.params.candidateID; //extract the id from the url parameter
        
        const response = await Candidate.findByIdAndDelete(candidateID);
        

        if(!response){
            return res.status(403).json({error:'candidate not found' });
        }

        console.log('data deleted');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error:'internal error'});
    }
})

//let's start voting
router.post('/vote/:candidateID', jwtAuthMiddleware ,async (req,res) =>{
    //no admin can vote 
    //user can only vote once
     candidateID = req.params.candidateID;
     userId = req.user.id;

    try{
        //find the candidate document with the specified candidateid
        const candidate = await Candidate.findById(candidateID);
        
        if(!candidate)
            return res.status(404).json({message: 'candidate not found'})

        const user = await User.findById(userId);
        if(!user)
            return res.status(404).json({message: 'user not found'});
        if(user.isVoted){
            res.status(400).json({message: 'user has already voted'});
        }
        if(user.role === 'admin'){
            res.status(400).json({message: 'admin can not vote'});
        }

        //update the candidate document to record the vote
        candidate.votes.push({user: userId})
        candidate.voteCount++;
        await candidate.save();

        //update the user doucment
        user.isVoted = true
        await user.save();

        res.status(200).json({message: 'vote recorded successfully'})
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'internal server error'})
    }
});

//vote count
router.get('/vote/count', async(req,res) =>{
    try{
        //find all candidate and short them by descending order
        const candidate = await Candidate.find().sort({voteCount: 'desc'});
        //map the candidate only with their name and vote count
        const voteRecord = candidate.map((data) =>{
            return{
                party: data.party,
                count: data.voteCount

            }
    });
    return res.status(200).json(voteRecord)
}catch(err){
    console.log(err);
        res.status(500).json({error: 'internal server error'})
}
});


module.exports = router;