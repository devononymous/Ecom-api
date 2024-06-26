import jwt from 'jsonwebtoken';
const jwtAuth = (req, res, next)=>{
    // 1. Read the token.
    const token = req.headers['authorization'];
    console.log("token ==>", token)
    // 2. if no token, return the error.
    if(!token){
        return res.status(401).send('Unauthorized');
    }
    // 3. check if token is valid.
    try{
        const secret_code = process.env.JWT_SECRET
        const payload = jwt.verify(
            token,
            secret_code
        );
        console.log(secret_code, "secret_code runner")
        req.userID = payload.userID;
        console.log(req.userID, "req.userID")
        console.log("payload ==>", payload);
    } catch(err){
        // 4. return error.
        console.log(err);
        return res.status(401).send('Unauthorized');
    }

    // 5. call next middleware.
    next();
};

export default jwtAuth;