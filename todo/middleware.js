const jwt = require('jsonwebtoken');

function authenticateToken(req,res,next){
    const token = req.header.token;
    if(!token){
        return res.status(401).json({message:"Access Denied"});
    }

    const decoded = jwt.verify(token,"secret");
    if(decoded.userId){
     req.userId = parseInt(decoded.userId);
    next();
    }
    else{
        return res.status(401).json({message:"Invalid Token"});
    }
}


module.exports ={
    authenticateToken,
}