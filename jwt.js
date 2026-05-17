const jwt = require('jsonwebtoken');

const jwtAuthMiddleware  = (req,res,next)=>{

    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({ error: 'unauthorized' })
    //extract the jwt tokens from the request headers
    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({ error: 'unauthorized'});
    try{
        //verify the jwt token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //attach user info to the request object
        req.user = decoded;
        next();
    }catch(err){
        console.error(err);
        res.status(401).json({error: 'Invalid Token'});
    }

    
}
//function to generate JWT Token
const generateToken = (userData) =>{
        //generate a new JWT Token using user Data
        return jwt.sign(userData, process.env.JWT_SECRET,{expiresIn:30000})
    }

module.exports= {jwtAuthMiddleware,generateToken}