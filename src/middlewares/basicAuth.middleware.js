import { UserModel } from "../features/user/user.model.js";
const basicAuthorizer = (req,res,next) =>{
    // 1. Check if authorizer header is empty

    const authHeader = req.headers["authorization"];
    console.log("authHeader", authHeader)
    if(!authHeader){
        return res.status(401).send("No authorization details found")
    }

    // 2. Extract the credentials [Basic rghehthgr2345gfdrgh]
    const base64Credentials = authHeader.replace('Basic ','');
    console.log(base64Credentials, "base64Credentials")

    // 3. decode credentials.
    const decodedCreds = Buffer.from(base64Credentials, 'base64').toString('utf8')
    console.log("decodedCreds",decodedCreds) // [username:password]
    const creds = decodedCreds.split(':');

   const user = UserModel.getAll().find(u=> u.email == creds[0] && u.password == creds[1]);
   if(user){
    next();
   }
   else{
    return res.status(401).send("Incorrect Credentials");
   }

}

export default basicAuthorizer;