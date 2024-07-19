import { UserModel } from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async resetPassword(req,res,next){
    const {newPassword} = req.body;
    const hashedPassword = await bcrypt.hash(newPassword,12);
    const userID = req.userID;
    console.log("userID ===>", userID)
    try {
       await this.userRepository.resetPassword(userID, hashedPassword)
       res.status(200).send("Password is updated.");
    } catch (error) {
      console.log("error in reset password ==>", error);
      console.log("passing error to the middleware");
      next(error) 
    }
  }
  async signUp(req, res,next) {
    const { name, email, password, type } = req.body;
    // const hashedPassword = await bcrypt.hash(password, 12);
    try {
      
      const user = new UserModel(name, email, password, type);
      await this.userRepository.signUp(user);
      res.status(201).send(user);
    } catch (error) {
      next(error)
    }
  }

  async signIn(req, res, next) {
    try{
      // 1. Find user by email.
      const user = await this.userRepository.findByEmail(req.body.email);
      console.log("user ===>", user)
      console.log("req.body.email ===>", req.body.email)

      if(!user){
        return res
        .status(400)
        .send('Incorrect Credentials');
      } else {
        // 2. Compare password password with hashed password.
        const result = await bcrypt.compare(req.body.password, user.password);
        if(result){
          // 3. Create token.
          const token = jwt.sign(
            {
              userID: user._id,
              email: user.email,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: '5h',
            }
          );
      // 4. Send token.
      return res.status(200).send(token);
        } else {
          return res
        .status(400)
        .send('Incorrect Credentials');
        }
      }
  } catch(err){
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }
}
